import { apiV1BaseRoute, TAttributeValue, TAttributeInput, TProductReviewInput } from "@cromwell/core";
import { Express } from 'express';
import { getCustomRepository } from "typeorm";
import { ProductRepository, ProductCategoryRepository, AttributeRepository, ProductReviewRepository } from '@cromwell/core-backend';


export const applyMockController = (app: Express): void => {

    const productRepo = getCustomRepository(ProductRepository);
    const productCategoryRepo = getCustomRepository(ProductCategoryRepository);
    const attributeRepo = getCustomRepository(AttributeRepository);
    const productReviewRepo = getCustomRepository(ProductReviewRepository);

    // attributes
    let attributesMock: TAttributeInput[] = [{
        key: "Size",
        values: [{ value: "35" }, { value: "36" }, { value: "37" }, { value: "38" }, { value: "39" }, { value: "40" }, { value: "41" }, { value: "42" }, { value: "43" }, { value: "44" }, { value: "45" }],
        type: 'radio'
    },
    {
        key: 'Color',
        values: [{ value: "Orange", icon: '/images/color_orange.png' }, { value: "Purple", icon: '/images/color_purple.png' }, { value: "Blue", icon: '/images/color_blue.png' }],
        type: 'radio'
    }];

    // reviews
    const reviewsMock: TProductReviewInput[] = [
        {
            title: 'Just awesome',
            description: 'Best product ever',
            rating: 5,
            userName: 'Bob',
        },
        {
            title: 'All good',
            description: 'Statisfied on 99%',
            rating: 4.5,
            userName: 'Mark',
        },
        {
            title: 'Neat',
            description: "You can go with it, buy I'm good",
            rating: 4,
            userName: 'Tom',
        },
        {
            title: 'Could be better',
            description: "For the record, it is not good",
            rating: 3,
            userName: 'Will',
        },
        {
            title: 'Sad',
            description: 'Remind me not to buy this stuff again',
            rating: 2,
            userName: 'Billy',
        },
        {
            title: 'How?',
            description: 'How could it be so bad?',
            rating: 1,
            userName: 'Max',
        },
    ]

    /**
    * Delete all products and mock new
    */
    app.get(`/${apiV1BaseRoute}/mock/products`, function (req, res) {
        new Promise(async (done) => {

            const mockedProdList = [
                {
                    name: '12 Monkeys',
                    price: 12.0,
                },
                {
                    name: 'Top Laptop',
                    price: 231.0,
                    oldPrice: 869.0,
                },
                {
                    name: 'YouPhone',
                    price: 210.0,
                    oldPrice: 1024.0,
                },
                {
                    name: 'Ulon Mesk',
                    price: 9999.0,
                    oldPrice: 0.0,
                },
                {
                    name: 'Throbber',
                    price: 1,
                    oldPrice: 2,
                },
                {
                    name: 'Teapot',
                    price: 10.0,
                    oldPrice: 11.0,
                },
                {
                    name: 'Intelligent Artificency',
                    price: 920.0,
                    oldPrice: 720.0,
                },
                {
                    name: 'Space Trampoline',
                    price: 1490.0,
                    oldPrice: 1490.01,
                },
                {
                    name: 'Meaning of 42',
                    price: 42.0
                },
                {
                    name: 'CyberCowboy',
                    price: 9128.0,
                },
                {
                    name: 'US SpaceForce',
                    price: 999.0,
                }
            ];

            const images = [
                '/images/product.jpg',
                '/images/product_2.jpg',
                '/images/product_3.jpg'
            ];
            const imagesNum = 6;
            const getRandImg = () => images[Math.round(Math.random() * (images.length - 1))];

            const sizeVals = attributesMock[0].values;
            const getRandSize = () => sizeVals[Math.round(Math.random() * (sizeVals.length - 1))];
            const sizesNum = 3;

            const description = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.</p><ul><li><i class="porto-icon-ok"></i>Any Product types that You want - Simple, Configurable</li><li><i class="porto-icon-ok"></i>Downloadable/Digital Products, Virtual Products</li><li><i class="porto-icon-ok"></i>Inventory Management with Backordered items</li></ul><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, <br>quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>';

            // Clear
            const prodsOld = await productRepo.find();
            for (const oldProd of prodsOld) {
                await productRepo.deleteProduct(oldProd.id);
            }

            const times = 20; // will create (times * 11) products

            for (let i = 0; i < times; i++) {
                for (const mock of mockedProdList) {
                    const mainImage = getRandImg();
                    let color = '';
                    if (mainImage === images[0]) color = 'Blue';
                    if (mainImage === images[1]) color = 'Orange';
                    if (mainImage === images[2]) color = 'Purple';

                    await productRepo.createProduct({
                        name: mock.name,
                        categoryIds: [],
                        price: mock.price,
                        oldPrice: mock.oldPrice,
                        mainImage: mainImage,
                        images: (() => {
                            const imgs: string[] = [mainImage];
                            for (let i = 0; i < imagesNum; i++) {
                                imgs.push(getRandImg())
                            };;
                            return imgs;
                        })(),
                        description: description,
                        attributes: [
                            {
                                key: 'Color',
                                values: [
                                    { value: color }
                                ]
                            },
                            {
                                key: 'Size',
                                values: (() => {
                                    const sizes: TAttributeValue[] = [];
                                    for (let i = 0; i < sizesNum; i++) {
                                        sizes.push(getRandSize())
                                    };;
                                    return sizes.sort();
                                })()
                            },
                            {
                                key: 'Condition',
                                values: [
                                    { value: Math.random() > 0.3 ? 'New' : 'Used' }
                                ]
                            }
                        ],
                        views: Math.floor(Math.random() * 1000)
                    })
                }
            }

            const cats = await productCategoryRepo.find();
            const prods = await productRepo.find();
            prods.forEach(p => {
                p.categories = cats;
                p.save();
            });

            res.send(true);
            done();
        })
    })




    app.get(`/${apiV1BaseRoute}/mock/attributes`, function (req, res) {
        new Promise(async (done) => {

            // Clear
            const attributsOld = await attributeRepo.find();
            for (const attr of attributsOld) {
                await attributeRepo.deleteAttribute(attr.id);
            }

            for (const attr of attributesMock) {
                await attributeRepo.createAttribute(attr);
            }

            res.send(true);
            done();
        })
    });

    app.get(`/${apiV1BaseRoute}/mock/reviews`, function (req, res) {
        new Promise(async (done) => {

            // Clear
            const reviewsOld = await productReviewRepo.find();
            for (const item of reviewsOld) {
                await productReviewRepo.deleteProductReview(item.id);
            }

            for (const item of reviewsMock) {
                await productReviewRepo.createProductReview(item);
            }

            res.send(true);
            done();
        })
    });
}