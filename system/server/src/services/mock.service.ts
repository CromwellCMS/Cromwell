import {
    TAttributeInput,
    TCreateUser,
    TOrderInput,
    TPost,
    TProduct,
    TProductCategoryInput,
    TProductReview,
    TProductReviewInput,
    TTag,
} from '@cromwell/core';
import {
    AttributeRepository,
    OrderRepository,
    PostRepository,
    ProductCategoryRepository,
    ProductRepository,
    ProductReviewRepository,
    TagRepository,
    UserRepository,
} from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import cryptoRandomString from 'crypto-random-string';
import nameGenerator from 'project-name-generator';
import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

@Injectable()
@Service()
export class MockService {
    private productRepo = getCustomRepository(ProductRepository);
    private productCategoryRepo = getCustomRepository(ProductCategoryRepository);
    private attributeRepo = getCustomRepository(AttributeRepository);
    private productReviewRepo = getCustomRepository(ProductReviewRepository);
    private postRepo = getCustomRepository(PostRepository);
    private userRepo = getCustomRepository(UserRepository);
    private orderRepo = getCustomRepository(OrderRepository);
    private tagRepo = getCustomRepository(TagRepository);

    private shuffleArray = <T extends Array<any>>(array: T): T => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // attributes
    private attributesMock: TAttributeInput[] = [{
        key: "Size",
        required: true,
        values: [{ value: "35" }, { value: "36" }, { value: "37" }, { value: "38" }, { value: "39" }, { value: "40" }, { value: "41" }, { value: "42" }, { value: "43" }, { value: "44" }, { value: "45" }],
        type: 'radio'
    },
    {
        key: 'Color',
        values: [{ value: "Orange", icon: '/plugins/@cromwell/plugin-product-filter/color_orange.png' },
        { value: "Purple", icon: '/plugins/@cromwell/plugin-product-filter/color_purple.png' },
        { value: "Blue", icon: '/plugins/@cromwell/plugin-product-filter/color_blue.png' }],
        type: 'radio'
    },
    {
        key: 'Condition',
        values: [{ value: "New" }, { value: "Used" }],
        type: 'radio'
    }];

    // reviews
    private reviewsMock: (Omit<TProductReviewInput, 'productId'>)[] = [
        {
            title: 'Just awesome',
            description: 'Best product ever!!!',
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
            description: "Ryan doesn't like it",
            rating: 2.5,
            userName: 'Kelly',
        },
        {
            title: '',
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
    ];

    public getRandomName = (): string => (nameGenerator().spaced).replace(/\b\w/g, l => l.toUpperCase());

    public async mockAll(): Promise<boolean> {
        await this.mockUsers();
        await this.mockTags();
        await this.mockPosts();
        await this.mockAttributes();
        await this.mockCategories();
        await this.mockProducts();
        await this.mockReviews();
        await this.mockOrders();

        return true;
    }

    public async mockProducts(amount?: number): Promise<boolean> {

        const images = [
            '/themes/@cromwell/theme-store/product1.png',
            '/themes/@cromwell/theme-store/product2.png',
            '/themes/@cromwell/theme-store/product3.png'
        ];
        const imagesNum = 6;
        const getRandImg = () => images[Math.floor(Math.random() * (images.length))];

        const sizeVals = this.attributesMock[0].values;

        const description = `<div id="quill-editor" class="ql-container ql-snow ql-disabled"><div class="ql-editor" data-gramm="false" contenteditable="false" data-placeholder="Let's write an awesome story!" spellcheck="true"><p><strong>Lorem ipsum dolor sit amet</strong>,<em> consectetur adipiscing elit,</em> sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p><blockquote>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.</blockquote><p><br></p><ul><li><span style="color: rgb(46, 46, 46);">Tempor orci eu lobortis elementum nibh tellus molestie nunc.</span></li><li><span style="color: rgb(46, 46, 46);">Mi proin sed libero enim.</span></li><li><span style="color: rgb(46, 46, 46);">Elit pellentesque habitant morbi tristique senectus et netus.</span></li></ul><p><br></p><p><u>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</u></p></div></div>`;
        const decrDelta = `{"ops":[{"attributes":{"bold":true},"insert":"Lorem ipsum dolor sit amet"},{"insert":","},{"attributes":{"italic":true},"insert":" consectetur adipiscing elit,"},{"insert":" sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat."},{"attributes":{"blockquote":true},"insert":"\\n"},{"insert":"\\n"},{"attributes":{"color":"#2e2e2e"},"insert":"Tempor orci eu lobortis elementum nibh tellus molestie nunc."},{"attributes":{"list":"bullet"},"insert":"\\n"},{"attributes":{"color":"#2e2e2e"},"insert":"Mi proin sed libero enim."},{"attributes":{"list":"bullet"},"insert":"\\n"},{"attributes":{"color":"#2e2e2e"},"insert":"Elit pellentesque habitant morbi tristique senectus et netus."},{"attributes":{"list":"bullet"},"insert":"\\n"},{"insert":"\\n"},{"attributes":{"underline":true},"insert":"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."},{"insert":"\\n"}]}`;

        const cats = await this.productCategoryRepo.find();

        const promises: Promise<TProduct>[] = [];
        const times = amount ?? 50;

        for (let i = 0; i < times; i++) {
            const mainImage = getRandImg();
            const price = Math.round(Math.random() * 1000)
            const oldPrice = Math.random() > 0.5 ? Math.round(price / Math.random()) : undefined;

            let color = '';
            if (mainImage === images[0]) color = 'Blue';
            if (mainImage === images[1]) color = 'Orange';
            if (mainImage === images[2]) color = 'Purple';

            this.shuffleArray(cats);
            const catsNum = Math.floor(Math.random() * cats.length)
            const categoryIds: string[] = cats.slice(0, catsNum).map(c => c.id);

            const condition = Math.random() > 0.3 ? 'New' : 'Used';

            promises.push(this.productRepo.createProduct({
                name: this.getRandomName(),
                categoryIds,
                price: price,
                oldPrice: oldPrice,
                mainImage: mainImage,
                images: (() => {
                    const imgs: string[] = [mainImage];
                    for (let i = 0; i < imagesNum; i++) {
                        imgs.push(getRandImg())
                    }
                    return imgs;
                })(),
                description: description,
                descriptionDelta: decrDelta,
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
                        values: this.shuffleArray(sizeVals).slice(0, Math.floor(Math.random() * 4) + 3).map(s => ({
                            value: s.value,
                            productVariant: {
                                price: price + Math.round(price * 0.2 * Math.random())
                            }
                        })).sort((a, b) => parseInt(a.value) - parseInt(b.value))
                    },
                    {
                        key: 'Condition',
                        values: [
                            {
                                value: condition,
                                productVariant: {
                                    price: condition === 'Used' ? Math.round(price * 0.4) : undefined
                                }
                            }
                        ]
                    }
                ],
                views: Math.floor(Math.random() * 1000)
            }));
        }
        await Promise.all(promises);

        return true;
    }


    public async mockCategories(amount?: number): Promise<boolean> {

        const categoriesMock: TProductCategoryInput[] = [];
        const firstLevelAmount = Math.floor((amount ?? 30) / 6);
        for (let i = 0; i < firstLevelAmount; i++) {
            const name = this.getRandomName();
            categoriesMock.push({
                name,
                description: name + ' description goes here...'
            })
        }

        const maxSubcatNum = Math.floor((amount ?? 30) / 10);

        for (const cat of categoriesMock) {
            const catEntity = await this.productCategoryRepo.createProductCategory(cat);

            const subCatsNum = Math.floor(Math.random() * maxSubcatNum);
            for (let j = 0; j < subCatsNum; j++) {
                const name = this.getRandomName();
                const subcatIput1 = {
                    name,
                    description: name + ' description',
                    parentId: catEntity.id
                } as TProductCategoryInput;
                const subcatLevel1 = await this.productCategoryRepo.createProductCategory(subcatIput1);

                const subCatsNum2 = Math.floor(Math.random() * maxSubcatNum);
                for (let k = 0; k < subCatsNum2; k++) {
                    const name = this.getRandomName();
                    const subcatIput2 = {
                        name,
                        description: name + ' description',
                        parentId: subcatLevel1.id
                    } as TProductCategoryInput;
                    const subcatLevel2 = await this.productCategoryRepo.createProductCategory(subcatIput2);

                    const subCatsNum3 = Math.floor(Math.random() * maxSubcatNum);
                    for (let m = 0; m < subCatsNum3; m++) {
                        const name = this.getRandomName();
                        const subcatIput3 = {
                            name,
                            description: name + ' description',
                            parentId: subcatLevel2.id
                        } as TProductCategoryInput;
                        await this.productCategoryRepo.createProductCategory(subcatIput3);
                    }
                }
            }

        }

        return true;
    }

    public async mockAttributes() {
        for (const attr of this.attributesMock) {
            await this.attributeRepo.createAttribute(attr);
        }

        return true;
    }

    public getRandomElementsFromArray<T>(array: Array<T>, maxNum: number) {
        const actualNum = Math.round(Math.random() * maxNum);
        array = this.shuffleArray([...array]);
        const result: T[] = [];
        for (let i = 0; i < actualNum; i++) {
            const idx = Math.round(Math.random() * array.length);
            result.push(array[idx]);
        }
        return result;
    }


    public async mockReviews() {
        const products = await this.productRepo.find();
        const promises: Promise<TProductReview>[] = [];

        for (const prod of products) {
            if (Math.random() < 0.3) continue;
            this.shuffleArray(this.reviewsMock);
            let reviewsNum = Math.floor(Math.random() * this.reviewsMock.length);
            if (reviewsNum > 5) reviewsNum = 5;

            for (let i = 0; i < reviewsNum && i < this.reviewsMock.length; i++) {
                const review: TProductReviewInput = {
                    ...this.reviewsMock[i],
                    productId: prod.id,
                    approved: Math.random() > 0.3,
                }
                promises.push(this.productReviewRepo.createProductReview(review));
            }
        }
        await Promise.all(promises);

        return true;
    }

    public async mockUsers() {

        const users: TCreateUser[] = [
            {
                fullName: 'Creed',
                email: 'Creed@example.com',
                password: cryptoRandomString({ length: 12 }),
                role: 'author',
            },
            {
                fullName: 'Pam',
                email: 'Pam@example.com',
                password: cryptoRandomString({ length: 12 }),
                role: 'author',
            },
            {
                fullName: 'Michael',
                email: 'Michael@example.com',
                password: cryptoRandomString({ length: 12 }),
                role: 'author',
            },
            {
                fullName: 'Kevin',
                email: 'Kevin@example.com',
                password: cryptoRandomString({ length: 12 }),
                role: 'customer',
            },
            {
                fullName: 'Dwight',
                email: 'Dwight@example.com',
                password: cryptoRandomString({ length: 12 }),
                role: 'administrator',
            },
        ]

        for (const user of users) {
            await this.userRepo.createUser(user);
        }
        return true;
    }

    public async mockPosts(amount?: number) {

        const users = await this.userRepo.find({
            where: {
                role: 'author'
            }
        });

        const images = [
            '/themes/@cromwell/theme-blog/post1.jpg',
            '/themes/@cromwell/theme-blog/post2.jpg',
            '/themes/@cromwell/theme-blog/post3.jpg'
        ];

        const getRandImg = () => images[Math.floor(Math.random() * (images.length))];

        const postQuillDelta = '{"ops":[{"insert":"Lorem ipsum dolor sit amet"},{"attributes":{"header":2},"insert":"\\n"},{"insert":"\\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Ac tortor dignissim convallis aenean et tortor. In iaculis nunc sed augue. Tristique senectus et netus et malesuada fames ac turpis. Fermentum leo vel orci porta non pulvinar neque. In fermentum posuere urna nec tincidunt praesent semper. Massa eget egestas purus viverra. \\nNunc eget lorem dolor sed viverra ipsum nunc aliquet. Praesent semper feugiat nibh sed pulvinar proin. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat. Tortor dignissim convallis aenean et tortor at risus. Sit amet tellus cras adipiscing enim eu turpis. Turpis tincidunt id aliquet risus feugiat. "},{"attributes":{"blockquote":true},"insert":"\\n"},{"insert":"\\nEt odio pellentesque diam volutpat. Imperdiet nulla malesuada pellentesque elit. Libero nunc consequat interdum varius sit amet mattis vulputate enim.\\n\\n"},{"attributes":{"bold":true},"insert":"Integer vitae justo eget magna fermentum iaculis eu. "},{"attributes":{"list":"bullet"},"insert":"\\n"},{"attributes":{"italic":true},"insert":"Fringilla urna porttitor rhoncus dolor. Sapien et ligula ullamcorper malesuada. "},{"attributes":{"list":"bullet"},"insert":"\\n"},{"attributes":{"underline":true},"insert":"Urna nec tincidunt praesent semper feugiat nibh. "},{"attributes":{"list":"bullet"},"insert":"\\n"},{"attributes":{"strike":true},"insert":"Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. "},{"attributes":{"list":"bullet"},"insert":"\\n"},{"insert":"\\n\\nUrna porttitor rhoncus dolor purus non enim. "},{"attributes":{"header":2},"insert":"\\n"},{"insert":"\\nArcu dui vivamus arcu felis bibendum ut tristique. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Mi proin sed libero enim. Elit pellentesque habitant morbi tristique senectus et netus. Tincidunt eget nullam non nisi est sit amet facilisis. Ipsum dolor sit amet consectetur adipiscing. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Turpis egestas integer eget aliquet nibh praesent tristique magna sit. Nibh praesent tristique magna sit amet purus. \\n\\n\\nPulvinar neque laoreet suspendisse interdum consectetur libero id. "},{"attributes":{"header":3},"insert":"\\n"},{"insert":"\\nElit eget gravida cum sociis natoque penatibus et. Nunc faucibus a pellentesque sit amet porttitor eget dolor morbi. Varius quam quisque id diam vel quam elementum pulvinar etiam. Lorem ipsum dolor sit amet consectetur adipiscing elit. Potenti nullam ac tortor vitae purus faucibus. Mattis nunc sed blandit libero volutpat. Facilisi nullam vehicula ipsum a. "},{"attributes":{"align":"center"},"insert":"\\n"}]}';
        const postContent = '<div class="editor_jY3Vp ql-container ql-snow ql-disabled" id="editor"><div class="ql-editor" data-gramm="false" contenteditable="false"><h2>Lorem ipsum dolor sit amet</h2><p><br></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Ac tortor dignissim convallis aenean et tortor. In iaculis nunc sed augue. Tristique senectus et netus et malesuada fames ac turpis. Fermentum leo vel orci porta non pulvinar neque. In fermentum posuere urna nec tincidunt praesent semper. Massa eget egestas purus viverra. </p><blockquote>Nunc eget lorem dolor sed viverra ipsum nunc aliquet. Praesent semper feugiat nibh sed pulvinar proin. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat. Tortor dignissim convallis aenean et tortor at risus. Sit amet tellus cras adipiscing enim eu turpis. Turpis tincidunt id aliquet risus feugiat. </blockquote><p><br></p><p>Et odio pellentesque diam volutpat. Imperdiet nulla malesuada pellentesque elit. Libero nunc consequat interdum varius sit amet mattis vulputate enim.</p><p><br></p><ul><li><strong>Integer vitae justo eget magna fermentum iaculis eu. </strong></li><li><em>Fringilla urna porttitor rhoncus dolor. Sapien et ligula ullamcorper malesuada. </em></li><li><u>Urna nec tincidunt praesent semper feugiat nibh. </u></li><li><s>Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. </s></li></ul><p><br></p><p><br></p><h2>Urna porttitor rhoncus dolor purus non enim. </h2><p><br></p><p>Arcu dui vivamus arcu felis bibendum ut tristique. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Mi proin sed libero enim. Elit pellentesque habitant morbi tristique senectus et netus. Tincidunt eget nullam non nisi est sit amet facilisis. Ipsum dolor sit amet consectetur adipiscing. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Turpis egestas integer eget aliquet nibh praesent tristique magna sit. Nibh praesent tristique magna sit amet purus. </p><p><br></p><p><br></p><h3>Pulvinar neque laoreet suspendisse interdum consectetur libero id. </h3><p><br></p><p class="ql-align-center">Elit eget gravida cum sociis natoque penatibus et. Nunc faucibus a pellentesque sit amet porttitor eget dolor morbi. Varius quam quisque id diam vel quam elementum pulvinar etiam. Lorem ipsum dolor sit amet consectetur adipiscing elit. Potenti nullam ac tortor vitae purus faucibus. Mattis nunc sed blandit libero volutpat. Facilisi nullam vehicula ipsum a. </p></div><div class="ql-clipboard" contenteditable="true" tabindex="-1"></div><div class="ql-tooltip ql-hidden"><a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL"><a class="ql-action"></a><a class="ql-remove"></a></div></div>';

        const promises: Promise<TPost>[] = [];

        for (let i = 0; i < (amount ?? 15); i++) {

            const tagIds: string[] = (await this.tagRepo.getAll()).map(tag => tag.id);

            promises.push(this.postRepo.createPost({
                content: postContent,
                delta: postQuillDelta,
                authorId: users[Math.floor(Math.random() * (users.length))].id,
                title: this.getRandomName(),
                mainImage: getRandImg(),
                published: true,
                isEnabled: true,
                tagIds: this.getRandomElementsFromArray(tagIds, 3),
                publishDate: new Date(Date.now()),
                featured: Math.random() < 0.2,
                excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            }));
        }
        await Promise.all(promises);

        return true;
    }

    public async mockOrders(amount?: number) {

        const mockedOrders: TOrderInput[] = [
            {
                customerName: 'Kevin',
                customerAddress: '976 Sunburst Drive',
                customerPhone: '786-603-4232',
                cartTotalPrice: 279,
                orderTotalPrice: 279,
                shippingPrice: 0,
                totalQnt: 3,
                status: 'Pending',
                cart: [{
                    product: {
                        id: '1',
                    },
                    amount: 2
                }, {
                    product: {
                        id: '2',
                    },
                }],
            },
            {
                customerName: 'Michael',
                customerAddress: '4650 Watson Lane',
                customerPhone: '704-408-1669',
                status: 'Cancelled',
                cartTotalPrice: 59,
                orderTotalPrice: 69,
                shippingPrice: 10,
                totalQnt: 2,
                cart: [{
                    product: {
                        id: '3',
                    },
                    amount: 1
                }, {
                    product: {
                        id: '4',
                    },
                }]
            },
            {
                customerName: 'Kelly',
                customerAddress: '957 Whitman Court',
                customerPhone: '206-610-2907',
                status: 'Shipped',
                cartTotalPrice: 110,
                orderTotalPrice: 120,
                shippingPrice: 10,
                totalQnt: 3,
                cart: [{
                    product: {
                        id: '5',
                    },
                    amount: 3
                }]
            },
            {
                customerName: 'Pam',
                customerAddress: '304 Norman Street',
                customerPhone: '203-980-3109',
                status: 'Awaiting shipment',
                cartTotalPrice: 10,
                orderTotalPrice: 15,
                shippingPrice: 5,
                cart: [{
                    product: {
                        id: '6',
                    },
                }]
            },
        ];

        const promises: Promise<any>[] = [];
        // 14 days
        for (let i = 0; i < 14; i++) {
            const dateFrom = new Date(Date.now());
            dateFrom.setUTCDate(dateFrom.getUTCDate() - i);

            // 0 - amount orders a day
            for (let j = 0; j < Math.ceil(Math.random() * (amount ?? 28) / 14); j++) {
                const createOrder = async () => {
                    const order = await this.orderRepo.createOrder({
                        ...(this.shuffleArray([...mockedOrders])[0])
                    });
                    order.createDate = dateFrom;
                    await order.save();
                }
                promises.push(createOrder());
            }
        }

        await Promise.all(promises);
        return true;
    }


    public async mockTags(amount?: number) {
        const promises: Promise<TTag | void>[] = [];
        for (let i = 0; i < (amount ?? 10); i++) {
            promises.push(this.tagRepo.createTag({
                name: this.getRandomName().split(' ')[0]
            }).then(it => it).catch((e) => { console.error(e); }));
        }
        await Promise.all(promises);
        return true;
    }
}