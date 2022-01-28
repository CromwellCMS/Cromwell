import { render, screen } from '@testing-library/react';
import React from 'react';
import { TPagedList, TProductReview } from '@cromwell/core';
import loadable from '@loadable/component';

const testData: TPagedList<TProductReview> = {
  elements: [
    {
      id: 1,
      title: '_test1_',
    },
    {
      id: 2,
      title: '_test2_',
    }
  ]
}

jest.mock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  return {
    ...originalModule,
    getGraphQLClient: () => {
      return {
        getFilteredProductReviews: jest.fn().mockImplementation(async () => testData)
      }
    },
    CList: (props: any) => {
      const Comp = loadable(async () => {
        const items: TPagedList<any> = await props.loader();
        const ListItem = props.ListItem;
        return () => (
          <div>
            {items.elements?.map(it => {
              return <ListItem key={it.id} data={it} listItemProps={props.listItemProps} />
            })}
          </div>
        )
      });
      return <Comp />;
    },
    CContainer: (props) => <div>{props.children}</div>,
    CText: (props) => <p>{props.children}</p>,
    getRestApiClient: () => {
      return {
        getCmsStatus: () => null,
      }
    },
  }
});


import { ProductReviews } from './ProductReviews';

describe('ProductReviews', () => {

  it("renders list", async () => {
    render(<ProductReviews
      productId={1}
    />);

    await screen.findByText(testData.elements?.[0]?.title + '');
    await screen.findByText(testData.elements?.[1]?.title + '');
  });

})