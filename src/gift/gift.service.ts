import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuyGiftDto, GiftDto, SendGiftDto } from 'src/dto/request/Gift.dto';
import { GiftLogService } from 'src/gift-log/gift-log.service';
import { Gift, GiftDocument } from 'src/schemas/gift.schema';
import { SystemService } from 'src/system/system.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GiftService {
    constructor(
        @InjectModel(Gift.name) private giftModel: Model<GiftDocument>,
        private readonly giftLogService: GiftLogService,
        private readonly userService: UserService,
        private readonly systemService: SystemService,
    ) {}

    async findAll() {
        return {
            message: 'Get list gifts successfully',
            data: {
                gifts: await this.giftModel.find(),
            },
        };
    }

    async create(body: GiftDto) {
        try {
            return {
                message: 'Created gift successfully',
                data: {
                    gift: await this.giftModel.create({
                        name: body.name,
                        price: body.value,
                        image: body.image,
                    }),
                },
            };
        } catch (error) {
            throw new BadRequestException('Something went wrong');
        }
    }

    async update(giftId: string, body: GiftDto) {
        try {
            if (!body.name && !body.value && !body.image) {
                throw new BadRequestException('Please enter name, value or image');
            }

            const gift = await this.giftModel.findById(giftId);
            if (!gift) {
                throw new NotFoundException('Gift not found');
            }

            if (body.name) gift.name = body.name;
            if (body.value) gift.price = body.value;
            if (body.image) gift.image = body.image;

            await gift.save();

            return {
                message: 'Updated gift successfully',
                data: {
                    gift,
                },
            };
        } catch (error) {
            throw new BadRequestException('Something went wrong');
        }
    }

    async delete(giftId: string) {
        try {
            await this.giftModel.deleteOne({ _id: giftId });
            return {
                message: 'Deleted gift successfully',
                data: {
                    id: giftId,
                },
            };
        } catch (error) {
            throw new BadRequestException('Something went wrong');
        }
    }

    async send(sendId: string, body: SendGiftDto) {
        try {
            const { receiveId, giftId } = body;
            const result = await this.userService.updateBagSendGift(sendId, receiveId, giftId);

            await this.giftLogService.createSendGiftLog(sendId, receiveId, giftId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async buy(userId: string, body: BuyGiftDto) {
        try {
            const { giftId, quantity } = body;
            const gift = await this.giftModel.findById(body.giftId);

            const updateUser = await this.userService.updateBagBuyGift(userId, {
                giftId: gift._id.toString(),
                quantity,
                price: gift.price,
            });

            await this.giftLogService.createBuyGiftLog(userId, giftId, quantity);

            return {
                message: 'Buy gift successfully',
                data: {
                    bag: updateUser.bag,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async exchange(userId: string, giftId: string, quantity: number) {
        // try {
        //     const user = await this.userService.findByIdWithValidate(userId);
        //     const itemBag = await this.userService.findItemInBag(userId, giftId);
        //     if (!itemBag) {
        //         throw new NotFoundException("Gift doesn't exist in your bag or in system.");
        //     }
        //     if (itemBag.quantity < quantity) {
        //         throw new BadRequestException("Don't have enough gift to exchange");
        //     } else {
        //         const gift = await this.giftModel.findById(giftId);
        //         const exchangeGift = await this.systemService.findByNameWithValidate('COIN_EXCHANGE_RATE');
        //         user.wallet_amount += quantity * gift.price * +exchangeGift.value;
        //         itemBag.quantity -= quantity;
        //         //TODO: add transaction here
        //     }
        //     await user.save();
        //     return {
        //         message: 'Exchange gift to coin successfully',
        //         data: {
        //             user,
        //         },
        //     };
        // } catch (error) {
        //     throw error;
        // }
    }
}
