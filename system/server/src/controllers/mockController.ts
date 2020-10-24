import { TAttributeInput, TProductCategoryInput, TProductReviewInput } from '@cromwell/core';
import {
    AttributeRepository,
    ProductCategoryRepository,
    ProductRepository,
    ProductReviewRepository,
} from '@cromwell/core-backend';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

export const getMockController = (): Router => {
    const mockController = Router();

    const productRepo = getCustomRepository(ProductRepository);
    const productCategoryRepo = getCustomRepository(ProductCategoryRepository);
    const attributeRepo = getCustomRepository(AttributeRepository);
    const productReviewRepo = getCustomRepository(ProductReviewRepository);

    const shuffleArray = <T extends Array<any>>(array: T): T => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    // attributes
    let attributesMock: TAttributeInput[] = [{
        key: "Size",
        values: [{ value: "35" }, { value: "36" }, { value: "37" }, { value: "38" }, { value: "39" }, { value: "40" }, { value: "41" }, { value: "42" }, { value: "43" }, { value: "44" }, { value: "45" }],
        type: 'radio'
    },
    {
        key: 'Color',
        values: [{ value: "Orange", icon: '/plugins/ProductFilter/color_orange.png' },
        { value: "Purple", icon: '/plugins/ProductFilter/color_purple.png' },
        { value: "Blue", icon: '/plugins/ProductFilter/color_blue.png' }],
        type: 'radio'
    },
    {
        key: 'Condition',
        values: [{ value: "New" }, { value: "Used" }],
        type: 'radio'
    }];

    // reviews
    const reviewsMock: (Omit<TProductReviewInput, 'productId'>)[] = [
        {
            title: 'Just awesome',
            description: 'Best product ever!',
            rating: 5,
            userName: 'Kevin',
        },
        {
            title: 'All good',
            description: 'Satisfied on 99%',
            rating: 4.5,
            userName: 'Jim',
        },
        {
            title: 'Nothing special',
            description: "You can go with it, but I'm good",
            rating: 4,
            userName: 'Dwight',
        },
        {
            title: 'Not bad',
            description: "To be honest it could be worse but well it wasn't",
            rating: 3.5,
            userName: 'Tobby',
        },
        {
            title: 'Could be better',
            description: "Actually, for the record, it is NOT good",
            rating: 3,
            userName: 'Oscar',
        },
        {
            title: '',
            description: 'Ryan do not recommend it',
            rating: 2.5,
            userName: 'Kelly',
        },
        {
            title: 'It smells like death',
            description: 'Remind me not to buy this stuff again',
            rating: 2,
            userName: 'Creed',
        },
        {
            title: '',
            description: 'Way too flashy',
            rating: 1.5,
            userName: 'Angela',
        },
        {
            title: '',
            description: 'How could it be SO bad?!',
            rating: 1,
            userName: 'Michael',
        },
    ]


    /**
     * @swagger
     * 
     * /mock/products:
     *   get:
     *     description: Delete all products and mock new
     *     tags: 
     *       - Mock
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: success
     */
    mockController.get(`/products`, function (req, res) {
        new Promise(async (done) => {

            const mockedProdList = [
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
                }
            ];

            const images = [
                '/themes/cromwell-demoshop/product.jpg',
                '/themes/cromwell-demoshop/product_2.jpg',
                '/themes/cromwell-demoshop/product_3.jpg'
            ];
            const imagesNum = 6;
            const getRandImg = () => images[Math.floor(Math.random() * (images.length))];

            const sizeVals = attributesMock[0].values;

            const description = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.</p><ul><li><i class="porto-icon-ok"></i>Any Product types that You want - Simple, Configurable</li><li><i class="porto-icon-ok"></i>Downloadable/Digital Products, Virtual Products</li><li><i class="porto-icon-ok"></i>Inventory Management with Backordered items</li></ul><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, <br>quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>';

            // Clear
            const prodsOld = await productRepo.find();
            for (const oldProd of prodsOld) {
                await productRepo.deleteProduct(oldProd.id);
            }

            const cats = await productCategoryRepo.find();

            const times = 50; // will create (times * 9) products

            for (let i = 0; i < times; i++) {
                for (const mock of mockedProdList) {
                    const mainImage = getRandImg();
                    let color = '';
                    if (mainImage === images[0]) color = 'Blue';
                    if (mainImage === images[1]) color = 'Orange';
                    if (mainImage === images[2]) color = 'Purple';

                    shuffleArray(cats);
                    const catsNum = Math.floor(Math.random() * cats.length)
                    const categoryIds: string[] = cats.slice(0, catsNum).map(c => c.id);

                    const condition = Math.random() > 0.3 ? 'New' : 'Used';

                    await productRepo.createProduct({
                        name: mock.name,
                        categoryIds,
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
                                    {
                                        value: color,
                                        productVariant: {
                                            images: [mainImage]
                                        }
                                    }
                                ]
                            },
                            {
                                key: 'Size',
                                values: shuffleArray(sizeVals).slice(0, Math.floor(Math.random() * 4) + 3).map(s => ({
                                    value: s.value,
                                    productVariant: {
                                        price: mock.price + Math.round(mock.price * 0.2 * Math.random())
                                    }
                                })).sort((a, b) => parseInt(a.value) - parseInt(b.value))
                            },
                            {
                                key: 'Condition',
                                values: [
                                    {
                                        value: condition,
                                        productVariant: {
                                            price: condition === 'Used' ? Math.round(mock.price * 0.4) : undefined
                                        }
                                    }
                                ]
                            }
                        ],
                        views: Math.floor(Math.random() * 1000)
                    })
                }
            }

            res.send(true);
            done();
        })
    })


    /**
     * @swagger
     * 
     * /mock/categories:
     *   get:
     *     description: Delete all categories and mock new
     *     tags: 
     *       - Mock
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: success
     */
    mockController.get(`/categories`, function (req, res) {
        new Promise(async (done) => {


            // Clear
            const categories = await productCategoryRepo.find();
            for (const cat of categories) {
                productCategoryRepo.delete(cat.id)
            }

            const categoriesMock: TProductCategoryInput[] = []
            for (let i = 0; i < 20; i++) {
                const name = 'Category ' + (i + 1);
                categoriesMock.push({
                    name,
                    description: name + ' description'
                })
            }

            for (const cat of categoriesMock) {
                const catEntity = await productCategoryRepo.createProductCategory(cat);
                const subCatsNum = Math.floor(Math.random() * 5);
                const subCats: TProductCategoryInput[] = [];
                for (let j = 0; j < subCatsNum; j++) {
                    const name = 'Subcategory ' + (j + 1);
                    const subcat = {
                        name,
                        description: name + ' description',
                        parentId: catEntity.id
                    };
                    await productCategoryRepo.createProductCategory(subcat);
                }

            }

            res.send(true);
            done();
        })
    });


    /**
     * @swagger
     * 
     * /mock/attributes:
     *   get:
     *     description: Delete all attributes and mock new
     *     tags: 
     *       - Mock
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: success
     */
    mockController.get(`/attributes`, function (req, res) {
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


    /**
     * @swagger
     * 
     * /mock/reviews:
     *   get:
     *     description: Delete all product reviews and mock new
     *     tags: 
     *       - Mock
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: success
     */
    mockController.get(`/reviews`, function (req, res) {
        new Promise(async (done) => {

            // Clear
            const reviewsOld = await productReviewRepo.find();
            for (const item of reviewsOld) {
                await productReviewRepo.deleteProductReview(item.id);
            }

            const products = await productRepo.find();
            for (const prod of products) {
                shuffleArray(reviewsMock);
                const reviewsNum = Math.floor(Math.random() * reviewsMock.length)
                for (let i = 0; i < reviewsNum && i < reviewsMock.length; i++) {
                    const review: TProductReviewInput = {
                        ...reviewsMock[i],
                        productId: prod.id
                    }
                    await productReviewRepo.createProductReview(review);
                }
            }

            res.send(true);
            done();
        })
    });

    return mockController;
}

