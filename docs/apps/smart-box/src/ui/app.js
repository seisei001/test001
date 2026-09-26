import { CoreModel } from '../modules/core-model/CoreModel.js';
import { RAGSearch } from '../modules/rag-search/RAGSearch.js';
import { IndexedDBManager } from '../modules/rag-search/IndexedDBManager.js';
import { ProfileMemo } from '../modules/profile-memo/ProfileMemo.js';
import { LLMTeacher } from '../modules/llm-teacher/LLMTeacher.js';
import { LoRAForward } from '../modules/lora-training/LoRAForward.js';
import { FeedbackProcessor } from '../modules/lora-training/FeedbackProcessor.js';
import { TurnController } from '../modules/turn-controller/TurnController.js';

const CONFIG_BASE = '../../configs/';
const LLM_SETTINGS_KEY = 'llmSettings';

async function loadConfig(name) {
  const response = await fetch(`${CONFIG_BASE}${name}`);
  if (!response.ok) throw new Error(`Failed to load config: ${name}`);
  return response.json();
}

async function boot(onModelProgress) {
  const [systemConfig, ragConfig, profileConfig, llmConfigStatic, loraConfig] = await Promise.all([
    loadConfig('system.config.json'),
    loadConfig('rag.config.json'),
    loadConfig('profile.config.json'),
    loadConfig('llm.config.json'),
    loadConfig('lora.config.json'),
  ]);

  const db = new IndexedDBManager(systemConfig.storage);
  await db.initialize();

  const llmSettings = (await db.getMetadata(LLM_SETTINGS_KEY)) || { enabled: llmConfigStatic.enabled, apiKey: '' };
  const llmConfig = { ...llmConfigStatic, enabled: llmSettings.enabled };

  const coreModel = new CoreModel(systemConfig, null);
  await coreModel.initialize(onModelProgress);

  const rag = new RAGSearch(db, ragConfig.search);

  const profileMemo = new ProfileMemo(profileConfig, db);
  await profileMemo.initialize();

  const llmTeacher = llmConfig.enabled && llmSettings.apiKey ? new LLMTeacher(llmConfig, llmSettings.apiKey) : null;

  const lora = new LoRAForward(loraConfig, db);
  await lora.loadWeights();

  const feedbackProcessor = new FeedbackProcessor(loraConfig);

  const controller = new TurnController(
    coreModel,
    rag,
    profileMemo,
    llmTeacher,
    lora,
    feedbackProcessor,
    systemConfig,
    profileConfig
  );

  return { controller, db, llmConfigStatic, llmSettings };
}

function setupSettingsPanel(db, llmConfigStatic, llmSettings) {
  const toggleBtn = document.getElementById('settings-toggle');
  const panel = document.getElementById('settings-panel');
  const enabledCheckbox = document.getElementById('llm-enabled');
  const apiKeyInput = document.getElementById('llm-api-key');
  const saveBtn = document.getElementById('settings-save');

  enabledCheckbox.checked = !!llmSettings.enabled;
  apiKeyInput.value = llmSettings.apiKey || '';

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('hidden');
  });

  saveBtn.addEventListener('click', async () => {
    await db.setMetadata(LLM_SETTINGS_KEY, {
      enabled: enabledCheckbox.checked,
      apiKey: apiKeyInput.value.trim(),
    });
    location.reload();
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setupOpeningScreen(controller, onSessionStarted) {
  const questions = controller.getSessionOpeningQuestions();

  const topicBlock = document.getElementById('question-topic-block');
  const topicLabel = document.getElementById('question-topic-label');
  const topicInput = document.getElementById('question-topic-input');
  const approachBlock = document.getElementById('question-approach-block');
  const approachLabel = document.getElementById('question-approach-label');
  const approachInput = document.getElementById('question-approach-input');
  const nextBtn = document.getElementById('opening-next-btn');

  topicLabel.textContent = questions.topic;
  approachLabel.textContent = questions.approach;
  topicBlock.classList.remove('hidden');
  approachBlock.classList.remove('hidden');

  nextBtn.addEventListener('click', async () => {
    const topicAnswer = topicInput.value.trim();
    const approachAnswer = approachInput.value.trim();
    if (!topicAnswer || !approachAnswer) return;

    nextBtn.disabled = true;
    await controller.startSession(topicAnswer, approachAnswer);
    onSessionStarted();
  });
}

function appendUserBubble(transcript, text) {
  const turn = document.createElement('div');
  turn.className = 'turn';
  turn.innerHTML = `<div class="bubble user">${escapeHtml(text)}</div>`;
  transcript.appendChild(turn);
}

function appendResponseBubbles(transcript, controller, result) {
  const turn = document.createElement('div');
  turn.className = 'turn';

  let html = `
    <div class="bubble-label">本体AI</div>
    <div class="bubble own">${escapeHtml(result.ownAnswer)}</div>
  `;
  if (result.llmAnswer) {
    html += `
      <div class="bubble-label">LLM(先生役)</div>
      <div class="bubble llm">${escapeHtml(result.llmAnswer)}</div>
    `;
  }
  turn.innerHTML = html;

  if (result.clarifyingQuestion) {
    const cq = document.createElement('div');
    cq.className = 'clarifying-question';
    cq.innerHTML = `
      ${escapeHtml(result.clarifyingQuestion.text)}
      <form>
        <input type="text" placeholder="回答...">
        <button class="primary" type="submit">送信</button>
      </form>
    `;
    const form = cq.querySelector('form');
    const input = cq.querySelector('input');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const answer = input.value.trim();
      if (!answer) return;
      await controller.answerClarifyingQuestion(result.clarifyingQuestion.dimension, answer);
      cq.remove();
    });
    turn.appendChild(cq);
  }

  transcript.appendChild(turn);
}

function setupChatScreen(controller) {
  const transcript = document.getElementById('transcript');
  const input = document.getElementById('composer-input');
  const sendBtn = document.getElementById('composer-send');

  async function send() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    sendBtn.disabled = true;
    appendUserBubble(transcript, text);
    transcript.scrollTop = transcript.scrollHeight;

    try {
      const result = await controller.processTurn(text);
      appendResponseBubbles(transcript, controller, result);
      transcript.scrollTop = transcript.scrollHeight;

      // implicit engagement signalは簡易版(継続して話しているかどうか)。
      // 本格的な計測(engagementScore)はPhase 1.5で検証する(DESIGN.md 8.6節)。
      controller.learnFromTurn(result.turnData, { engagementScore: 0.5 }).catch((err) => {
        console.warn('learnFromTurn failed', err);
      });
    } catch (error) {
      console.error(error);
      const turn = document.createElement('div');
      turn.className = 'turn';
      turn.innerHTML = `<div class="bubble own">エラーが発生しました: ${escapeHtml(error.message)}</div>`;
      transcript.appendChild(turn);
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
}

// modelKeyごとに、ファイル名→{loaded, total}を積み上げて、複数ファイルをまたいだ
// 合計ダウンロード進捗を計算する(1ファイルの進捗だけを見ると、ファイルが切り替わる
// たびに0%に戻ったように見えてしまうため)。
const fileProgressByModel = { embedding: {}, generation: {} };

function computeOverallPercent(modelKey) {
  const files = fileProgressByModel[modelKey];
  const totals = Object.values(files);
  const loadedSum = totals.reduce((sum, f) => sum + f.loaded, 0);
  const totalSum = totals.reduce((sum, f) => sum + f.total, 0);
  return totalSum > 0 ? (loadedSum / totalSum) * 100 : 0;
}

function updateLoadingMessage() {
  const el = document.getElementById('loading-message');
  if (!el) return;
  const parts = [];
  if (Object.keys(fileProgressByModel.embedding).length > 0) {
    parts.push(`embedding ${Math.round(computeOverallPercent('embedding'))}%`);
  }
  if (Object.keys(fileProgressByModel.generation).length > 0) {
    parts.push(`生成 ${Math.round(computeOverallPercent('generation'))}%`);
  }
  el.textContent = parts.length > 0
    ? `AIモデルを読み込んでいます…(${parts.join(' / ')})`
    : 'AIモデルを読み込んでいます…';
}

function showOpeningError(message) {
  document.getElementById('loading-status').classList.add('hidden');
  document.getElementById('loading-error').classList.remove('hidden');
  document.getElementById('loading-error-detail').textContent = message;
}

async function runApp() {
  const { controller, db, llmConfigStatic, llmSettings } = await boot((info) => {
    fileProgressByModel[info.modelKey][info.file] = { loaded: info.loaded, total: info.total };
    updateLoadingMessage();
  });

  document.getElementById('loading-status').classList.add('hidden');
  document.getElementById('question-topic-block').classList.remove('hidden');
  document.getElementById('question-approach-block').classList.remove('hidden');
  document.getElementById('opening-next-btn').classList.remove('hidden');

  setupSettingsPanel(db, llmConfigStatic, llmSettings);

  setupOpeningScreen(controller, () => {
    document.getElementById('opening-screen').classList.add('hidden');
    document.getElementById('chat-screen').classList.remove('hidden');
    setupChatScreen(controller);
  });
}

function main() {
  runApp().catch((error) => {
    console.error('smart-box: failed to initialize', error);
    showOpeningError(error.message);
  });

  document.getElementById('loading-retry-btn')?.addEventListener('click', () => {
    location.reload();
  });
}

main();
