import { DirectStrategy } from './strategies/direct.js';
import { ContrastiveStrategy } from './strategies/contrastive.js';
import { ClarificationStrategy } from './strategies/clarification.js';
import { ProbingStrategy } from './strategies/probing.js';

/**
 * QuestionGenerator — question.config.json の confidenceThresholds に基づき戦略を選び、
 * frequency制御(maxQuestionsPerSession, minTurnsBetweenQuestions, skipIfConfidenceAbove)
 * を適用してから質問文を生成する。DESIGN.md 5.4節を参照。
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
   * @param {string} intent - BERTInference.classify() の intent
   * @param {number} confidence - BERTInference.classify() の confidence
   * @param {object} ragContext - RAGSearch.search() の結果
   * @param {object} userModel - 好みベクトル・確信度スコア
   * @returns {Promise<{questionText: string, strategy: string, dimension: string} | null>}
   *   confidenceThresholds.direct 以上、またはfrequency制御に引っかかった場合は null
   *   (=質問せず直接応答)
   */
  async generateQuestion(intent, confidence, ragContext, userModel) {
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

  /**
   * userModel.confidenceScores の中で最も確信度が低い次元(examples_count等)を返す。
   * @param {object} userModel
   * @param {object} ragContext
   * @returns {string}
   */
  selectDimension(userModel, ragContext) {
    throw new Error('not implemented');
  }
}

export default QuestionGenerator;
