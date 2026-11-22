import { AnalysisRepository } from '../models/Analysis.js';

export async function getHistory(req, res, next) {
  try {
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const history = await AnalysisRepository.findAll({ limit });
    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnalysisById(req, res, next) {
  try {
    const { id } = req.params;
    const analysis = await AnalysisRepository.findById(id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Analysis record with ID "${id}" was not found.`
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAnalysis(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await AnalysisRepository.deleteById(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Analysis record with ID "${id}" was not found or already deleted.`
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}
