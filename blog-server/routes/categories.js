const express = require('express');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 获取所有分类
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories.map(c => c.name));   // 返回字符串数组，符合前端习惯
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加分类（需登录）
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: '分类名称不能为空' });
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: '分类已存在' });
    await new Category({ name }).save();
    const categories = await Category.find().sort('name');
    res.json(categories.map(c => c.name));
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新分类（需登录）
router.put('/:oldName', authMiddleware, async (req, res) => {
  try {
    const { newName } = req.body;
    if (!newName) return res.status(400).json({ message: '新名称不能为空' });
    const category = await Category.findOne({ name: req.params.oldName });
    if (!category) return res.status(404).json({ message: '分类不存在' });
    category.name = newName;
    await category.save();
    // 同步更新所有文章的 category 字段（可选）
    const Article = require('../models/Article');
    await Article.updateMany({ category: req.params.oldName }, { category: newName });
    const categories = await Category.find().sort('name');
    res.json(categories.map(c => c.name));
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除分类（需登录）
router.delete('/:name', authMiddleware, async (req, res) => {
  try {
    await Category.findOneAndDelete({ name: req.params.name });
    // 可考虑将相关文章的分类置空
    const Article = require('../models/Article');
    await Article.updateMany({ category: req.params.name }, { category: '' });
    const categories = await Category.find().sort('name');
    res.json(categories.map(c => c.name));
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;