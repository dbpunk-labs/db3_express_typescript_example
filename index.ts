//
// index.ts
// Copyright (C) 2023 db3.network Author imotai <codego.me@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {
createFromPrivateKey,
getCollection,
addDoc,
updateDoc,
deleteDoc,
queryDoc,
createClient,
syncAccountNonce
} from 'db3.js';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
interface Book {
  name: string;
  author: string;
  rate: string;
}

app.get('/curd', async (req: Request, res: Response) => {
    const account = createFromPrivateKey("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
    const client = createClient(
        "https://rollup.cloud.db3.network",
        "https://index.cloud.db3.network",
        account
    );
    await syncAccountNonce(client);
    const collection = await getCollection(
        "0x6ef32f0d8fc6bc872ffa977eb80920a0a75d0206",
        "book",
        client
    );
    const { id } = await addDoc(collection, {
        name: "The Three-Body Problem",
        author: "Cixin-Liu1",
        rate: "4.10"
    } as Book);
    await updateDoc(collection,id,  {
        name: "The Three-Body Problem",
        author: "Cixin-Liu1",
        rate: "4.11"
    } as Book);
    await deleteDoc(collection, [id]);
    res.send(id);
});

app.get('/', async (req: Request, res: Response) => {
    const account = createFromPrivateKey("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
    const client = createClient(
        "https://rollup.cloud.db3.network",
        "https://index.cloud.db3.network",
        account
    );

    const collection = await getCollection(
        "0x6ef32f0d8fc6bc872ffa977eb80920a0a75d0206",
        "book",
        client
    );

     const resultSet = await queryDoc<Book>(
        collection,
        "/[author=Cixin-Liu1]"
     );
    res.send(JSON.stringify(resultSet.docs));
});

app.listen(port, () => {
   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
