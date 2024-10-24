const express = require('express');
const Page = require('../models/custompages');
const router = express.Router();


router.post('/admin/pages', async (req, res) => {
  console.log('POST request received');  
  const { title, content, slug } = req.body;

  try {
    let page = await Page.findOne({ slug });

    if (page) {
      page.title = title;
      page.content = content;
      page.lastUpdated = Date.now();
    } else {
      page = new Page({ title, content, slug });
    }

    await page.save();
    res.status(200).json({ message: 'Page saved successfully', page });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save page', error });
  }
  if (response.status === 200) {
    navigate('/admin/custom-pages'); 
  }
});


// GET: Fetch all pages
router.get('/allpages', async (req, res) => {
  try {
    const pages = await Page.find();
    console.log(pages);

    if (!pages || pages.length === 0) {
      return res.status(404).json({ message: 'No pages found' });
    }

    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error); 
    res.status(500).json({ message: 'Failed to fetch pages', error });
  }
});



router.get('/count', async (req, res) => {
  try {
    const userCount = await Page.countDocuments();
    res.json({ total: userCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user count' });
  }
});


// Get Page by Slug
router.get('/pages/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const page = await Page.findOne({ slug });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch page', error });
  }
});

// Delete Page (Admin only)
router.delete('/pages/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    await Page.findOneAndDelete({ slug });
    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete page', error });
  }
});

// Update Page by Slug
router.put('/edit-pages/:slug', async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;

  try {
    const page = await Page.findOneAndUpdate(
      { slug },
      { title, content, lastUpdated: Date.now() },
      { new: true }
    );
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.status(200).json({ message: 'Page updated successfully', page });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update page', error });
  }
});



module.exports = router;
