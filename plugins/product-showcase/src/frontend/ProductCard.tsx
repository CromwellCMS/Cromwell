import { TProduct } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import React from 'react';

export function DefaultProductCard(props: { product?: TProduct | undefined }) {
  const p = props.product;
  if (p)
    return (
      <div key={p.id}>
        <img src={p?.mainImage ?? undefined} width="300px" />
        <Link href={`/product/${p.slug}`}>
          <a>{p.name}</a>
        </Link>
        <p>{p.price}</p>
      </div>
    );
  else return <></>;
}
