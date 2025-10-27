import express from 'express';
import {
  getSummary,
  getMRR,
  getChurn,
  getPlans,
  getProducts,
  getCustomers,
  generateDummyData,
  healthCheck
} from '../controllers/analyticsController.js';
import { cacheMiddleware, CACHE_TTL } from '../utils/cacheUtils.js';
import { authenticateApiKey, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/analytics/summary
 * @desc    Get comprehensive analytics summary
 * @access  Protected
 * @query   startDate, endDate, productId, planId, userId
 */
router.get('/summary', authenticateApiKey, cacheMiddleware(CACHE_TTL.SUMMARY), getSummary);

/**
 * @route   GET /api/analytics/mrr
 * @desc    Get MRR trend over time
 * @access  Protected
 * @query   startDate, endDate, productId, planId, userId
 */
router.get('/mrr', authenticateApiKey, cacheMiddleware(CACHE_TTL.MRR), getMRR);

/**
 * @route   GET /api/analytics/churn
 * @desc    Get churn analysis and trends
 * @access  Protected
 * @query   startDate, endDate, productId, planId, userId
 */
router.get('/churn', authenticateApiKey, cacheMiddleware(CACHE_TTL.CHURN), getChurn);

/**
 * @route   GET /api/analytics/plans
 * @desc    Get metrics breakdown by plan
 * @access  Protected
 * @query   startDate, endDate, productId, planId, userId
 */
router.get('/plans', authenticateApiKey, cacheMiddleware(CACHE_TTL.PLANS), getPlans);

/**
 * @route   GET /api/analytics/products
 * @desc    Get metrics breakdown by product
 * @access  Protected
 * @query   startDate, endDate, productId, planId, userId
 */
router.get('/products', authenticateApiKey, cacheMiddleware(CACHE_TTL.PRODUCTS), getProducts);

/**
 * @route   GET /api/analytics/customers
 * @desc    Get customer-level metrics
 * @access  Protected
 * @query   startDate, endDate, productId, planId, userId, limit
 */
router.get('/customers', authenticateApiKey, cacheMiddleware(CACHE_TTL.CUSTOMERS), getCustomers);

/**
 * @route   POST /api/analytics/simulate
 * @desc    Generate dummy data for testing (Development only)
 * @access  Public
 * @body    { months: number, usersPerPlan: number }
 */
router.post('/simulate', generateDummyData);

/**
 * @route   GET /api/analytics/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', healthCheck);

export default router;
