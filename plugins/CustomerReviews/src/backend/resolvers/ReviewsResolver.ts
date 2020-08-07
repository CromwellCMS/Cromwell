import { Resolver, Query } from "type-graphql";
import { getManager } from "typeorm";
import { ProductShowcaseReviews } from '../entities/ProductShowcaseReviews';


@Resolver(ProductShowcaseReviews)
export default class ReviewsResolver {

    @Query(() => [ProductShowcaseReviews])
    async productShowcaseReviews() {
        const reviews = await getManager().find(ProductShowcaseReviews);
        return reviews ? reviews : [];
    }
}