const router = require('express').Router();
const quotesSchema = require('../models/moses-quotes-schema');

router.get('/', async (req, res) => {
    try {
        res.status(301).redirect('https://discord.com/invite/cHs56zgFBy');
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

// ?quoteId=1&sort=asc&limit=1
router.get('/quotes', async (req, res) => {
    const quoteIdQ = req.query.quoteId ?? null;
    if (quoteIdQ < 1 && quoteIdQ !== null) return res.status(400).json({ status: 400, message: 'quoteId should be greater than 0' });

    const sortQ = req.query.sort ?? null;
    if (!['asc', 'desc'].includes(sortQ) && sortQ !== null) return res.status(400).json({ status: 400, message: 'sort only accepts "asc" or "desc"' });
    const sort = {
        asc: '1',
        desc: '-1',
    };

    const limitQ = req.query.limit ?? null;
    if (limitQ < 1 && limitQ !== null) return res.status(400).json({ status: 400, message: 'limit should be greater than 0' });

    try {
        const quotes = await quotesSchema
            .find(quoteIdQ ? { quoteId: parseInt(quoteIdQ) } : {})
            .sort({ quoteId: sortQ ? parseInt(sort[sortQ]) : 1 })
            .limit(limitQ);

        res.status(200).json({ query: { quoteId: quoteIdQ, sort: sortQ, limit: limitQ }, content: quotes });
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/quotes/random', async (req, res) => {
    try {
        const randomQuote = await quotesSchema.aggregate([{ $sample: { size: 1 } }]);

        res.status(200).json({ content: randomQuote });
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

module.exports = router;