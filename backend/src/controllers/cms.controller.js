const cmsService = require('../services/cms.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

// Blog
const getBlogPosts = async (req, res, next) => {
  try {
    const result = await cmsService.getBlogPosts(req.query);
    return sendResponse(res, 200, 'Blog posts retrieved', result.posts, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getBlogPostBySlug = async (req, res, next) => {
  try {
    const result = await cmsService.getBlogPostBySlug(req.params.slug);
    return sendResponse(res, 200, 'Blog post retrieved', result);
  } catch (error) {
    next(error);
  }
};

const createBlogPost = async (req, res, next) => {
  try {
    const post = await cmsService.createBlogPost(req.body);
    return sendResponse(res, 201, 'Blog post created', post);
  } catch (error) {
    next(error);
  }
};

const updateBlogPost = async (req, res, next) => {
  try {
    const post = await cmsService.updateBlogPost(req.params.id, req.body);
    return sendResponse(res, 200, 'Blog post updated', post);
  } catch (error) {
    next(error);
  }
};

const deleteBlogPost = async (req, res, next) => {
  try {
    await cmsService.deleteBlogPost(req.params.id);
    return sendResponse(res, 200, 'Blog post deleted');
  } catch (error) {
    next(error);
  }
};

// FAQ
const getFaqs = async (req, res, next) => {
  try {
    const faqs = await cmsService.getFaqs();
    return sendResponse(res, 200, 'FAQs retrieved', faqs);
  } catch (error) {
    next(error);
  }
};

const createFaq = async (req, res, next) => {
  try {
    const faq = await cmsService.createFaq(req.body);
    return sendResponse(res, 201, 'FAQ created', faq);
  } catch (error) {
    next(error);
  }
};

// Testimonials
const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await cmsService.getTestimonials();
    return sendResponse(res, 200, 'Testimonials retrieved', testimonials);
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await cmsService.createTestimonial(req.body);
    return sendResponse(res, 201, 'Testimonial created', testimonial);
  } catch (error) {
    next(error);
  }
};

// Contact
const submitContact = async (req, res, next) => {
  try {
    const message = await cmsService.submitContact(req.body);
    return sendResponse(res, 201, 'Your inquiry has been received. Our team will contact you shortly.', message);
  } catch (error) {
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const messages = await cmsService.getContactMessages();
    return sendResponse(res, 200, 'Contact messages retrieved', messages);
  } catch (error) {
    next(error);
  }
};

// Settings
const getSettings = async (req, res, next) => {
  try {
    const settings = await cmsService.getSettings();
    return sendResponse(res, 200, 'Settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await cmsService.updateSettings(req.body);
    return sendResponse(res, 200, 'Settings updated', settings);
  } catch (error) {
    next(error);
  }
};

// Support Helpdesk
const createTicket = async (req, res, next) => {
  try {
    const ticket = await cmsService.createTicket(req.user._id, req.body);
    return sendResponse(res, 201, 'Support ticket submitted.', ticket);
  } catch (error) {
    next(error);
  }
};

const getUserTickets = async (req, res, next) => {
  try {
    const tickets = await cmsService.getUserTickets(req.user._id);
    return sendResponse(res, 200, 'User tickets retrieved', tickets);
  } catch (error) {
    next(error);
  }
};

const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await cmsService.getAllTickets(req.query);
    return sendResponse(res, 200, 'All tickets retrieved', tickets);
  } catch (error) {
    next(error);
  }
};

const replyTicket = async (req, res, next) => {
  try {
    const { message, attachment, status } = req.body;
    const ticket = await cmsService.addTicketMessage(req.params.id, {
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message,
      attachment,
      status
    });
    return sendResponse(res, 200, 'Reply appended to ticket', ticket);
  } catch (error) {
    next(error);
  }
};

// CRM
const createLead = async (req, res, next) => {
  try {
    const lead = await cmsService.createLead(req.body);
    return sendResponse(res, 201, 'Lead created', lead);
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const leads = await cmsService.getLeads();
    return sendResponse(res, 200, 'Leads retrieved', leads);
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await cmsService.updateLead(req.params.id, req.body);
    return sendResponse(res, 200, 'Lead updated', lead);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getFaqs,
  createFaq,
  getTestimonials,
  createTestimonial,
  submitContact,
  getContactMessages,
  getSettings,
  updateSettings,
  createTicket,
  getUserTickets,
  getAllTickets,
  replyTicket,
  createLead,
  getLeads,
  updateLead
};
