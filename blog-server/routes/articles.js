const express = require('express');
const Article = require('../models/Article');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 获取文章列表（支持搜索和分类筛选）
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Article.countDocuments(filter);
    res.json({ articles, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: '文章不存在' });
    // 阅读量 +1
    article.views += 1;
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建文章（需登录）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容不能为空' });
    }
    const article = new Article({
      title,
      content,
      excerpt: excerpt || content.replace(/[#*>\n]/g, '').substring(0, 150),
      category: category || '未分类',
      tags: tags || [],
      author: req.user.username
    });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新文章
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!article) return res.status(404).json({ message: '文章不存在' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除文章
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: '文章不存在' });
    res.json({ message: '文章已删除' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;