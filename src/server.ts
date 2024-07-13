import app from './app';

const PORT = process.env.PORT || 6197;

app.listen(PORT, () => console.log(`Started server on ${PORT}`));