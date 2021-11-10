import {
    getRandStr,
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

import { resetAllPagesCache } from '../helpers/reset-page';

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
        resetAllPagesCache();

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

        const description = `<div class="codex-editor__redactor"><div class="ce-block"><div class="ce-block__content"><h2 class="ce-header">Lorem ipsum dolor sit amet</h2></div></div><div class="ce-block"><div class="ce-block__content"><div class="ce-paragraph cdx-block">Lorem ipsum dolor sit amet, c<b>onsectetur adipiscing elit,</b> sed do eiusmod tempor incididunt<mark class="cdx-marker"> ut labore et dolore magna aliqua.</mark></div></div></div><div class="ce-block"><div class="ce-block__content"><ul class="cdx-block cdx-list cdx-list--unordered"><li class="cdx-list__item">Integer vitae justo eget magna.&nbsp;</li><li class="cdx-list__item">Fermentum iaculis eu.</li></ul></div></div><div class="ce-block"><div class="ce-block__content"><div class="cdx-block"><div class="tc-wrap tc-wrap--readonly"><div class="tc-toolbox tc-toolbox--row"><div class="tc-toolbox__toggler"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><rect width="18" height="18" fill="#F4F5F7" rx="2"></rect><circle cx="11.5" cy="6.5" r="1.5"></circle><circle cx="11.5" cy="11.5" r="1.5"></circle><circle cx="6.5" cy="6.5" r="1.5"></circle><circle cx="6.5" cy="11.5" r="1.5"></circle></svg></div><div class="tc-popover"><div class="tc-popover__item" data-index="0"><div class="tc-popover__item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="#1D202B" d="M10.808 2.442l.01.012 2.52 3.503a.895.895 0 01.169.568v.067a.894.894 0 01-.249.632l-.01.012-3.064 3.093a.9.9 0 01-1.29-1.254l.011-.012 1.877-1.896c-1.824-.204-3.232.063-4.242.767-1.279.892-2.035 2.571-2.222 5.112a.901.901 0 01-1.796-.132c.224-3.035 1.205-5.212 2.988-6.456 1.342-.936 3.072-1.296 5.173-1.11L9.356 3.507a.9.9 0 011.443-1.076l.01.012z"></path></svg></div><div class="tc-popover__item-label">Add row above</div></div><div class="tc-popover__item" data-index="1"><div class="tc-popover__item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="#1D202B" d="M10.808 13.518l.01-.012 2.52-3.503a.895.895 0 00.169-.568v-.067a.894.894 0 00-.249-.632l-.01-.012-3.064-3.093a.9.9 0 00-1.29 1.254l.011.012 1.877 1.896c-1.824.204-3.232-.063-4.242-.767-1.279-.892-2.035-2.571-2.222-5.112a.901.901 0 00-1.796.132c.224 3.035 1.205 5.212 2.988 6.456 1.342.936 3.072 1.296 5.173 1.11l-1.327 1.841a.9.9 0 001.443 1.076l.01-.012z"></path></svg></div><div class="tc-popover__item-label">Add row below</div></div><div class="tc-popover__item" data-index="2"><div class="tc-popover__item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M12.277 3.763a.9.9 0 010 1.273L9.293 8.018l2.984 2.986a.9.9 0 01-1.273 1.272L8.02 9.291l-2.984 2.985a.9.9 0 01-1.273-1.272l2.984-2.986-2.984-2.982a.9.9 0 011.273-1.273L8.02 6.745l2.984-2.982a.9.9 0 011.273 0z"></path></svg></div><div class="tc-popover__item-label">Delete row</div></div></div></div><div class="tc-toolbox tc-toolbox--column"><div class="tc-toolbox__toggler"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><rect width="18" height="18" fill="#F4F5F7" rx="2"></rect><circle cx="11.5" cy="6.5" r="1.5"></circle><circle cx="11.5" cy="11.5" r="1.5"></circle><circle cx="6.5" cy="6.5" r="1.5"></circle><circle cx="6.5" cy="11.5" r="1.5"></circle></svg></div><div class="tc-popover"><div class="tc-popover__item" data-index="0"><div class="tc-popover__item-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><path transform="matrix(0 1 1 0 2.514 2.046)" d="M8.728-.038l.01.012 2.52 3.503a.895.895 0 01.169.568v.067a.894.894 0 01-.249.632l-.01.012-3.064 3.093a.9.9 0 01-1.29-1.254l.011-.012 1.877-1.896c-1.824-.204-3.232.063-4.242.767-1.279.892-2.035 2.571-2.222 5.112a.901.901 0 01-1.796-.132C.666 7.399 1.647 5.222 3.43 3.978c1.342-.936 3.072-1.296 5.173-1.11L7.276 1.027A.9.9 0 018.719-.05l.01.012z"></path></svg></div><div class="tc-popover__item-label">Add column to left</div></div><div class="tc-popover__item" data-index="1"><div class="tc-popover__item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="#1D202B" d="M13.552 10.774l-.012.01-3.503 2.52a.895.895 0 01-.568.169h-.067a.894.894 0 01-.632-.249l-.012-.01-3.093-3.064a.9.9 0 011.254-1.29l.012.011 1.896 1.877c.204-1.824-.063-3.232-.767-4.242-.892-1.279-2.571-2.035-5.112-2.222a.901.901 0 01.132-1.796c3.035.224 5.212 1.205 6.456 2.988.936 1.342 1.296 3.072 1.11 5.173l1.841-1.327a.9.9 0 011.077 1.443l-.012.01z"></path></svg></div><div class="tc-popover__item-label">Add column to right</div></div><div class="tc-popover__item" data-index="2"><div class="tc-popover__item-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M12.277 3.763a.9.9 0 010 1.273L9.293 8.018l2.984 2.986a.9.9 0 01-1.273 1.272L8.02 9.291l-2.984 2.985a.9.9 0 01-1.273-1.272l2.984-2.986-2.984-2.982a.9.9 0 011.273-1.273L8.02 6.745l2.984-2.982a.9.9 0 011.273 0z"></path></svg></div><div class="tc-popover__item-label">Delete column</div></div></div></div><div class="tc-table"><div class="tc-row"><div class="tc-cell"></div><div class="tc-cell">Column 1</div><div class="tc-cell">Column 2</div></div><div class="tc-row"><div class="tc-cell">Row 1</div><div class="tc-cell">Value 11</div><div class="tc-cell">Value 21</div></div><div class="tc-row"><div class="tc-cell">Row 2</div><div class="tc-cell">Value 12</div><div class="tc-cell">Value 22</div></div></div></div></div></div></div></div>`;
        const decrDelta = `{"time":1629832419374,"blocks":[{"id":"PJ5gA5-HBk","type":"header","data":{"text":"Lorem ipsum dolor sit amet","level":2}},{"id":"Avg-EfJlni","type":"paragraph","data":{"text":"Lorem ipsum dolor sit amet, c<b>onsectetur adipiscing elit,</b> sed do eiusmod tempor incididunt<mark class=\\"cdx-marker\\"> ut labore et dolore magna aliqua.</mark>"}},{"id":"mZ1HMldQCp","type":"list","data":{"style":"unordered","items":["Integer vitae justo eget magna.&nbsp;","Fermentum iaculis eu."]}},{"id":"f0tU5ppiWU","type":"table","data":{"withHeadings":false,"content":[["","Column 1","Column 2"],["Row 1","Value 11","Value 21"],["Row 2","Value 12","Value 22"]]}}],"version":"2.22.2"}`;

        const cats = await this.productCategoryRepo.find();

        let promises: Promise<TProduct>[] = [];
        const times = amount ?? 50;

        for (let i = 0; i < times; i++) {
            if (promises.length > 200) {
                await Promise.all(promises);
                promises = [];
            }

            const mainImage = getRandImg();
            const price = Math.round(Math.random() * 1000)
            const oldPrice = Math.random() > 0.5 ? Math.round(price / Math.random()) : undefined;

            let color = '';
            if (mainImage === images[0]) color = 'Blue';
            if (mainImage === images[1]) color = 'Orange';
            if (mainImage === images[2]) color = 'Purple';

            this.shuffleArray(cats);
            const catsNum = Math.floor(Math.random() * cats.length)
            const categoryIds: number[] = cats.slice(0, catsNum).map(c => c.id);

            const condition = Math.random() > 0.3 ? 'New' : 'Used';

            promises.push(this.productRepo.createProduct({
                name: this.getRandomName(),
                categoryIds,
                price: price,
                oldPrice: oldPrice,
                mainImage: mainImage,
                stockStatus: 'In stock',
                sku: `${getRandStr(4)}-${getRandStr(4)}`,
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
                        values: sizeVals ? this.shuffleArray(sizeVals).slice(0, Math.floor(Math.random() * 4) + 3).map(s => ({
                            value: s.value,
                            productVariant: {
                                price: price + Math.round(price * 0.2 * Math.random())
                            }
                        })).sort((a, b) => parseInt(a.value) - parseInt(b.value)) : [],
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
        const maxAmount = amount ?? 40;
        const categoriesMock: TProductCategoryInput[] = [];
        const firstLevelAmount = Math.floor((maxAmount) / 6);
        for (let i = 0; i < firstLevelAmount; i++) {
            const name = this.getRandomName();
            categoriesMock.push({
                name,
                description: name + ' description goes here...'
            })
        }

        const maxSubcatNum = Math.floor(maxAmount / 10 + 1);
        let created = 0

        for (const cat of categoriesMock) {
            const catEntity = await this.productCategoryRepo.createProductCategory(cat);
            created++;
            if (created > maxAmount) return true;

            const subCatsNum = Math.floor(Math.random() * maxSubcatNum * 2 + 1);
            for (let j = 0; j < subCatsNum; j++) {
                const name = this.getRandomName();
                const subcatIput1 = {
                    name,
                    description: name + ' description',
                    parentId: catEntity.id
                } as TProductCategoryInput;
                const subcatLevel1 = await this.productCategoryRepo.createProductCategory(subcatIput1);
                created++;
                if (created > maxAmount) return true;

                const subCatsNum2 = Math.floor(Math.random() * maxSubcatNum);
                for (let k = 0; k < subCatsNum2; k++) {
                    const name = this.getRandomName();
                    const subcatIput2 = {
                        name,
                        description: name + ' description',
                        parentId: subcatLevel1.id
                    } as TProductCategoryInput;
                    const subcatLevel2 = await this.productCategoryRepo.createProductCategory(subcatIput2);
                    created++;
                    if (created > maxAmount) return true;

                    const subCatsNum3 = Math.floor(Math.random() * maxSubcatNum);
                    for (let m = 0; m < subCatsNum3; m++) {
                        const name = this.getRandomName();
                        const subcatIput3 = {
                            name,
                            description: name + ' description',
                            parentId: subcatLevel2.id
                        } as TProductCategoryInput;
                        await this.productCategoryRepo.createProductCategory(subcatIput3);
                        created++;
                        if (created > maxAmount) return true;
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


    public async mockReviews(amount?: number) {
        const products = await this.productRepo.find();
        let promises: Promise<TProductReview>[] = [];

        const maxAmount = amount ?? 100;
        let mockedAmount = 0;

        for (const prod of products) {
            if (promises.length > 200) {
                await Promise.all(promises);
                promises = [];
            }

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

                mockedAmount++;
                if (mockedAmount > maxAmount) break;
            }
            if (mockedAmount > maxAmount) break;
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
                password: cryptoRandomString({ length: 14 }),
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

        const postData = '{"time":1629831852497,"blocks":[{"id":"ik9CPF8uzr","type":"header","data":{"text":"Lorem ipsum dolor sit amet","level":2}},{"id":"SpXFHh321s","type":"paragraph","data":{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus.&nbsp;"}},{"id":"evntxeTk-1","type":"paragraph","data":{"text":"&nbsp;&nbsp;"}},{"id":"u6lJrvCOp-","type":"quote","data":{"text":"Nunc eget lorem dolor sed viverra ipsum nunc aliquet. Praesent semper feugiat nibh sed pulvinar proin. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat.","caption":"","alignment":"left"}},{"id":"8N5SEfDKft","type":"list","data":{"style":"unordered","items":["<b>Integer vitae justo eget magna fermentum iaculis eu. </b>","<i>Fringilla urna porttitor rhoncus dolor. Sapien et ligula ullamcorper malesuada. </i>","<mark class=\\"cdx-marker\\">Urna nec tincidunt praesent semper feugiat nibh.</mark> ","<a href=\\"http://google.com\\">Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. </a>"]}},{"id":"5Uqz5H7tzK","type":"delimiter","data":{}},{"id":"g9DS6N-1oL","type":"paragraph","data":{"text":"&nbsp;"}},{"id":"6dvjYi-TY8","type":"image","data":{"file":{"url":"/themes/@cromwell/theme-blog/post3.jpg"},"caption":"","withBorder":false,"stretched":false,"withBackground":false}},{"id":"ArB8-wNE2U","type":"header","data":{"text":"Urna porttitor rhoncus dolor purus non enim. ","level":2}},{"id":"e8ut46M2dA","type":"paragraph","data":{"text":"Arcu dui vivamus arcu felis bibendum ut tristique. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Mi proin sed libero enim. Elit pellentesque habitant morbi tristique senectus et netus."}},{"id":"0GSm8CCrgc","type":"warning","data":{"title":"Elit pellentesque habitant morbi tristique senectus et netus.","message":""}},{"id":"fOdXHjp7d9","type":"delimiter","data":{}},{"id":"xvbDmOwNlK","type":"table","data":{"withHeadings":false,"content":[["Tincidunt eget nullam non nisi est sit amet facilisis. Ipsum dolor sit amet consectetur adipiscing","Fermentum posuere urna nec tincidunt praesent semper feugiat nibh.&nbsp;"],["Turpis egestas integer eget aliquet nibh praesent tristique magna sit.","Nibh praesent tristique magna sit amet purus.&nbsp;"]]}}],"version":"2.22.2"}';
        const postContent = '<div class="codex-editor__redactor"><div class="ce-block"><div class="ce-block__content"><h2 class="ce-header">Lorem ipsum dolor sit amet</h2></div></div><div class="ce-block"><div class="ce-block__content"><div class="ce-paragraph cdx-block">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. </div></div></div><div class="ce-block"><div class="ce-block__content"><div class="ce-paragraph cdx-block">  </div></div></div><div class="ce-block"><div class="ce-block__content"><blockquote class="cdx-block cdx-quote"><div class="cdx-input cdx-quote__text">Nunc eget lorem dolor sed viverra ipsum nunc aliquet. Praesent semper feugiat nibh sed pulvinar proin. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat.</div><div class="cdx-input cdx-quote__caption"></div></blockquote></div></div><div class="ce-block"><div class="ce-block__content"><ul class="cdx-block cdx-list cdx-list--unordered"><li class="cdx-list__item"><b>Integer vitae justo eget magna fermentum iaculis eu. </b></li><li class="cdx-list__item"><i>Fringilla urna porttitor rhoncus dolor. Sapien et ligula ullamcorper malesuada. </i></li><li class="cdx-list__item"><mark class="cdx-marker">Urna nec tincidunt praesent semper feugiat nibh.</mark> </li><li class="cdx-list__item"><a href="http://google.com">Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. </a></li></ul></div></div><div class="ce-block"><div class="ce-block__content"><div class="ce-delimiter cdx-block"></div></div></div><div class="ce-block"><div class="ce-block__content"><div class="ce-paragraph cdx-block"> </div></div></div><div class="ce-block"><div class="ce-block__content"><div class="cdx-block image-tool image-tool--loading"><div class="image-tool__image"><div class="image-tool__image-preloader"></div><img class="image-tool__image-picture" src="/themes/@cromwell/theme-blog/post3.jpg" /></div><div class="cdx-input image-tool__caption"></div><div class="cdx-button"> Select an Image</div></div></div></div><div class="ce-block"><div class="ce-block__content"><h2 class="ce-header">Urna porttitor rhoncus dolor purus non enim. </h2></div></div><div class="ce-block"><div class="ce-block__content"><div class="ce-paragraph cdx-block">Arcu dui vivamus arcu felis bibendum ut tristique. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Mi proin sed libero enim. Elit pellentesque habitant morbi tristique senectus et netus.</div></div></div><div class="ce-block"><div class="ce-block__content"><div class="cdx-block cdx-warning"><div class="cdx-input cdx-warning__title">Elit pellentesque habitant morbi tristique senectus et netus.</div><div class="cdx-input cdx-warning__message"></div></div></div></div><div class="ce-block"><div class="ce-block__content"><div class="ce-delimiter cdx-block"></div></div></div><div class="ce-block"><div class="ce-block__content"><div class="cdx-block"><div class="tc-wrap tc-wrap--readonly"><div class="tc-toolbox tc-toolbox--row"><div class="tc-toolbox__toggler"></div><div class="tc-popover"><div class="tc-popover__item"><div class="tc-popover__item-icon"></div><div class="tc-popover__item-label">Add row above</div></div><div class="tc-popover__item"><div class="tc-popover__item-icon"></div><div class="tc-popover__item-label">Add row below</div></div><div class="tc-popover__item"><div class="tc-popover__item-icon"></div><div class="tc-popover__item-label">Delete row</div></div></div></div><div class="tc-toolbox tc-toolbox--column"><div class="tc-toolbox__toggler"></div><div class="tc-popover"><div class="tc-popover__item"><div class="tc-popover__item-icon"></div><div class="tc-popover__item-label">Add column to left</div></div><div class="tc-popover__item"><div class="tc-popover__item-icon"></div><div class="tc-popover__item-label">Add column to right</div></div><div class="tc-popover__item"><div class="tc-popover__item-icon"></div><div class="tc-popover__item-label">Delete column</div></div></div></div><div class="tc-table"><div class="tc-row"><div class="tc-cell">Tincidunt eget nullam non nisi est sit amet facilisis. Ipsum dolor sit amet consectetur adipiscing</div><div class="tc-cell">Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. </div></div><div class="tc-row"><div class="tc-cell">Turpis egestas integer eget aliquet nibh praesent tristique magna sit.</div><div class="tc-cell">Nibh praesent tristique magna sit amet purus. </div></div></div></div></div></div></div></div>';

        let promises: Promise<TPost>[] = [];

        for (let i = 0; i < (amount ?? 15); i++) {
            if (promises.length > 200) {
                await Promise.all(promises);
                promises = [];
            }

            const tagIds: number[] = (await this.tagRepo.getAll()).map(tag => tag.id);

            promises.push(this.postRepo.createPost({
                content: postContent,
                delta: postData,
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
                        id: 1,
                    },
                    amount: 2
                }, {
                    product: {
                        id: 2,
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
                        id: 3,
                    },
                    amount: 1
                }, {
                    product: {
                        id: 4,
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
                        id: 5,
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
                        id: 6,
                    },
                }]
            },
        ];

        let promises: Promise<any>[] = [];
        // 14 days
        for (let i = 0; i < 14; i++) {
            const dateFrom = new Date(Date.now());
            dateFrom.setUTCDate(dateFrom.getUTCDate() - i);

            // 0 - amount orders a day
            for (let j = 0; j < Math.ceil(Math.random() * (amount ?? 56) / 14); j++) {
                if (promises.length > 200) {
                    await Promise.all(promises);
                    promises = [];
                }

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
        let promises: Promise<TTag | void>[] = [];

        for (let i = 0; i < (amount ?? 10); i++) {
            if (promises.length > 200) {
                await Promise.all(promises);
                promises = [];
            }

            promises.push(this.tagRepo.createTag({
                name: this.getRandomName().split(' ')[0]
            }).then(it => it).catch((e) => { console.error(e); }));
        }
        await Promise.all(promises);
        return true;
    }
}
