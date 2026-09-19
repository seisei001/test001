import { DirectStrategy } from './strategies/direct.js';
import { ContrastiveStrategy } from './strategies/contrastive.js';
import { ClarificationStrategy } from './strategies/clarification.js';
import { ProbingStrategy } from './strategies/probing.js';

/**
 * QuestionGenerator — question.config.json の confidenceThresholds に基づき戦略を選び、
 * frequency制御(maxQuestionsPerSession, minTurnsBetweenQuestions, skipIfConfidenceAbove)
 * を適用してから質問文を生成する。DESIGN.md 5.4節を参照。
 *
 * 2026-09-19改訂: confidence は BERT分類確信度ではなく RAGSearch.search() が返す
 * 最上位類似度(DESIGN.md 1.4節)。intent引数は廃止した(BERTInferenceが分類ヘッドを
 * 持たなくなったため。DESIGN.md 5.1節)。
 */
export class QuestionGenerator {
  /**
   * @param {object} questionConfig - question.config.json の内容
   */
  constructor(questionConfig) {
    this.config = questionConfig;
    this.strategies = {
      direct: new DirectStrategy(questionConfig.templates.direct),
      contrastive: new ContrastiveStrategy(questionConfig.templates.contrastive),
      clarification: new ClarificationStrategy(questionConfig.templates.clarification),
      probing: new ProbingStrategy(questionConfig.templates.probing),
    };
    /** セッション内で使った質問数・最後に質問したターン番号 */
    this.sessionState = { questionsAsked: 0, lastQuestionTurnIndex: -1 };
  }

  /**
   * @param {number} confidence - RAGSearch.search() が返す最上位類似度
   *   (LoRAForward.thresholdBias() 適用後の値。DESIGN.md 1.4節・5.5節)
   * @param {object} ragContext - RAGSearch.search() の結果(retrievedEntries等)
   * @returns {Promise<{questionText: string, strategy: string} | null>}
   *   confidenceThresholds.direct 以上、またはfrequency制御に引っかかった場合は null
   *   (=質問せず surface_related または acknowledge を返す。判断はTurnController側)
   */
  async generateQuestion(confidence, ragContext) {
    throw new Error('not implemented');
  }

  /**
   * confidenceに応じて 'direct' | 'clarification' | 'probing' | null(skip) を返す。
   * contrastiveはconfidenceに関わらずragContext次第で別途トリガーされ得る
   * (DESIGN.md 5.4節参照)。
   * @param {number} confidence
   * @returns {string | null}
   */
  selectStrategy(confidence) {
    throw new Error('not implemented');
  }
}

export default QuestionGenerator;
