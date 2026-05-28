require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  // 创建默认管理员
  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
    await User.create({
      username: 'admin',
      password: 'admin123',
      nickname: '管理员',
      role: 'admin'
    });
    console.log('✅ 默认管理员已创建 (admin / admin123)');
  } else {
    console.log('⏭️  管理员已存在');
  }

  // 创建默认分类
  const defaultCategories = ['前端开发', '后端技术', '人工智能', 'DevOps', '编程语言', '技术杂谈'];
  for (const name of defaultCategories) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({ name });
      console.log(`✅ 分类 “${name}” 已创建`);
    }
  }

  console.log('🎉 初始化完成');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});