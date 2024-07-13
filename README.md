# Profanity Detection Service. [Demo](https://threads-app-jg3g.onrender.com)

## Introduction

The Profanity Detection Service is designed to identify and filter out offensive language from text input. It leverages advanced text processing techniques and semantic analysis to accurately detect profane content. The service is built with modern technologies including [TypeScript](https://www.typescriptlang.org/), [Bun](https://bun.sh/), [Express](https://expressjs.com/), [LangChain](https://langchain.com/), and [Upstash Vector](https://upstash.com/vector).

## Features

- **Text Splitting**: Utilizes `RecursiveCharacterTextSplitter` from LangChain to split text into manageable chunks for processing.
- **Whitelist Filtering**: Allows specific words to be exempt from profanity checks.
- **Semantic Analysis**: Uses semantic chunking to enhance the detection accuracy.
- **Threshold-based Detection**: Flags content based on a configurable profanity score threshold.
- **CSV Parsing**: Supports CSV parsing for training data and batch processing.
- **Error Handling**: Implements robust error handling mechanisms.

## Upstash Vector

- **Scalable Vector Database**: Upstash Vector is a cloud-based vector database designed for high scalability and low latency, ideal for storing and querying vector embeddings.
- **Efficient Storage and Retrieval**: Provides efficient storage and retrieval of high-dimensional vectors, making it suitable for semantic search and similarity-based applications.
- **Integration with AI Models**: Seamlessly integrates with AI models to store and query embeddings, allowing for advanced text and semantic analysis.
- **High Availability**: Offers high availability and durability, ensuring that your data is always accessible and secure.
- **Easy to Use**: With a simple API and SDK, integrating Upstash Vector into your application is straightforward and hassle-free.

## Description

The Profanity Detection Service processes input text to detect and flag offensive language. The text is split into smaller chunks, both semantically and word-wise, and each chunk is checked against a profanity vector model. If the profanity score exceeds the specified threshold, the text is flagged as containing profanity.

## Installation

### Install Dependencies

First, install the global dependencies:

```shell
npm install -g bun
bun install # install project dependencies
```

### Setup .env file
Create a .env file in the root directory of your project and add the following environment variables:
``` shell
PORT
UPSTASH_VECTOR_REST_URL
UPSTASH_VECTOR_REST_TOKEN
```

### Start the app
```shell
bun run dev # Run in development mode with --watch
bun run seed # To seed the vector database with training data from a CSV file
```
<i>Written by Ashkan.</i>