const BlogPost = require('../models/BlogPost');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');
const SupportTicket = require('../models/SupportTicket');
const Settings = require('../models/Settings');
const Lead = require('../models/Lead');
const slugify = require('slugify');

class CmsService {
  // Blog
  async getBlogPosts(query = {}) {
    const { category, search, tag, page = 1, limit = 9, all = false } = query;
    const filter = all === 'true' ? {} : { isPublished: true };

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      posts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getBlogPostBySlug(slug) {
    const post = await BlogPost.findOne({ slug });
    if (!post) throw new Error('Blog post not found');
    const recentPosts = await BlogPost.find({ _id: { $ne: post._id }, isPublished: true }).limit(3);
    return { post, recentPosts };
  }

  async createBlogPost(data) {
    if (!data.slug) {
      data.slug = slugify(data.title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
    }
    return await BlogPost.create(data);
  }

  async updateBlogPost(id, data) {
    return await BlogPost.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBlogPost(id) {
    return await BlogPost.findByIdAndDelete(id);
  }

  // FAQ
  async getFaqs() {
    return await FAQ.find({ isActive: true }).sort({ order: 1 });
  }

  async getAllFaqs() {
    return await FAQ.find().sort({ order: 1 });
  }

  async createFaq(data) {
    return await FAQ.create(data);
  }

  async updateFaq(id, data) {
    return await FAQ.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteFaq(id) {
    return await FAQ.findByIdAndDelete(id);
  }

  // Testimonials
  async getTestimonials() {
    return await Testimonial.find({ isFeatured: true }).sort({ order: 1 });
  }

  async createTestimonial(data) {
    return await Testimonial.create(data);
  }

  // Contact
  async submitContact(data) {
    return await ContactMessage.create(data);
  }

  async getContactMessages() {
    return await ContactMessage.find().sort({ createdAt: -1 });
  }

  async updateContactStatus(id, { status, replyNotes }) {
    return await ContactMessage.findByIdAndUpdate(id, { status, replyNotes }, { new: true });
  }

  // Settings
  async getSettings() {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings;
  }

  async updateSettings(data) {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(data);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, data, { new: true });
    }
    return settings;
  }

  // Customer Support Helpdesk
  async createTicket(userId, { subject, category, priority, orderNumber, message, attachment }) {
    const user = await require('../models/User').findById(userId);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const count = await SupportTicket.countDocuments();
    const ticketNumber = `TCK-${dateStr}-${count + 101}`;

    const ticket = await SupportTicket.create({
      ticketNumber,
      user: userId,
      subject,
      category,
      priority: priority || 'Medium',
      orderNumber,
      messages: [{
        sender: userId,
        senderName: user ? user.name : 'Customer',
        senderRole: user ? user.role : 'Customer',
        message,
        attachment
      }]
    });

    return ticket;
  }

  async getUserTickets(userId) {
    return await SupportTicket.find({ user: userId }).sort({ createdAt: -1 });
  }

  async getAllTickets(query = {}) {
    const { status } = query;
    const filter = status ? { status } : {};
    return await SupportTicket.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
  }

  async addTicketMessage(ticketId, { senderId, senderName, senderRole, message, attachment, status }) {
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');

    ticket.messages.push({
      sender: senderId,
      senderName,
      senderRole,
      message,
      attachment
    });

    if (status) ticket.status = status;
    await ticket.save();
    return ticket;
  }

  // CRM Leads
  async createLead(data) {
    return await Lead.create(data);
  }

  async getLeads() {
    return await Lead.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
  }

  async updateLead(id, data) {
    return await Lead.findByIdAndUpdate(id, data, { new: true });
  }

  async addLeadActivity(id, activityData) {
    const lead = await Lead.findById(id);
    if (!lead) throw new Error('Lead not found');
    lead.activities.push(activityData);
    await lead.save();
    return lead;
  }
}

module.exports = new CmsService();
