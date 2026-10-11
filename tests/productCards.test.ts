import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ListingCard from '../src/components/ListingCard';
(globalThis as any).React=React;
test('Product cards hide private metrics and never invent revenue or user counts',()=>{
 const listing={id:'11111111-1111-4111-8111-111111111111',slug:'example',title:'Example',tagline:'Useful tool',category:'SaaS',logoUrl:'https://example.com/logo.png',websiteUrl:'https://example.com',mrr:'$999',usersCount:'1234',publicMetricsJson:'[]'};
 const html=renderToStaticMarkup(React.createElement(ListingCard,{listing}));
 assert.ok(!html.includes('$999'));assert.ok(!html.includes('1234'));assert.ok(!html.includes('$12,500'));assert.ok(html.includes('Save product'));
 const shared=renderToStaticMarkup(React.createElement(ListingCard,{listing:{...listing,publicMetricsJson:'["mrr"]'}}));assert.ok(shared.includes('$999'));assert.ok(shared.includes('seller reported'));assert.ok(!shared.includes('1234'));
});
