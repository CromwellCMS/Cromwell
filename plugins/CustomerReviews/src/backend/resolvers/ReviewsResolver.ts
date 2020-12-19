import { logLevelMoreThan } from '@cromwell/core';
import { Resolver, Query } from "type-graphql";
import { getManager } from "typeorm";
import ProductShowcaseReviews from '../entities/ProductShowcaseReviews';


@Resolver(ProductShowcaseReviews)
export default class ReviewsResolver {

    @Query(() => [ProductShowcaseReviews])
    async productShowcaseReviews() {
        if (logLevelMoreThan('detailed')) console.log('ReviewsResolver::productShowcaseReviews');
        const reviews = await getManager().find(ProductShowcaseReviews);
        return reviews ? reviews : [];
    }
}