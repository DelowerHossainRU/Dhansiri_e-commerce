const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cms.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// Blog public
router.get('/blog', cmsController.getBlogPosts);
router.get('/blog/:slug', cmsController.getBlogPostBySlug);
router.post('/blog', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), cmsController.createBlogPost);
router.put('/blog/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), cmsController.updateBlogPost);
router.delete('/blog/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), cmsController.deleteBlogPost);

// FAQ & Testimonials public
router.get('/faqs', cmsController.getFaqs);
router.post('/faqs', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), cmsController.createFaq);
router.get('/testimonials', cmsController.getTestimonials);
router.post('/testimonials', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), cmsController.createTestimonial);

// Contact messages
router.post('/contact', cmsController.submitContact);
router.get('/contact', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), cmsController.getContactMessages);

// Settings
router.get('/settings', cmsController.getSettings);
router.put('/settings', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), cmsController.updateSettings);

// Helpdesk tickets
router.post('/tickets', protect, cmsController.createTicket);
router.get('/tickets/my', protect, cmsController.getUserTickets);
router.get('/tickets', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.STAFF), cmsController.getAllTickets);
router.post('/tickets/:id/reply', protect, cmsController.replyTicket);

// CRM Leads
router.get('/leads', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.SALES_REP), cmsController.getLeads);
router.post('/leads', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.SALES_REP), cmsController.createLead);
router.put('/leads/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.SALES_REP), cmsController.updateLead);

module.exports = router;
