import { apiV1BaseRoute, TAttributeValue, TAttribute } from "@cromwell/core";
import { Express } from 'express';
import { getCustomRepository } from "typeorm";
import { ProductRepository, ProductCategoryRepository, AttributeRepository } from '@cromwell/core-backend';


export const applyMockController = (app: Express): void => {

    const productRepo = getCustomRepository(ProductRepository);
    const productCategoryRepo = getCustomRepository(ProductCategoryRepository);
    const attributeRepo = getCustomRepository(AttributeRepository);

    // attributes
    let attributes: TAttribute[] = [{
        key: "Size",
        values: [{ value: "35" }, { value: "36" }, { value: "37" }, { value: "38" }, { value: "39" }, { value: "40" }, { value: "41" }, { value: "42" }, { value: "43" }, { value: "44" }, { value: "45" }],
        type: 'radio'
    },
    {
        key: 'Color',
        values: [{ value: "Orange", icon: '/images/color_orange.png' }, { value: "Purple", icon: '/images/color_purple.png' }, { value: "Blue", icon: '/images/color_blue.png' }],
        type: 'radio'
    }];

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
                    price: 9999999.0,
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
                    price: 14900.0,
                    oldPrice: 14900.01,
                },
                {
                    name: 'Meaning of 42',
                    price: 42.0
                },
                {
                    name: 'CyberCowboy',
                    price: 912800.0,
                },
                {
                    name: 'US SpaceForce',
                    price: 99999.0,
                }
            ];

            const images = [
                '/images/product.jpg',
                '/images/product_2.jpg',
                '/images/product_3.jpg'
            ];
            const imagesNum = 6;
            const getRandImg = () => images[Math.round(Math.random() * (images.length - 1))];

            const sizeVals = attributes[0].values;
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
                            }
                        ]
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

            for (const attr of attributes) {
                await attributeRepo.createAttribute(attr);
            }

            res.send(true);
            done();
        })
    })
}