import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true,
})
export class Coupon {
    @Prop({
        required: true,
        type: String,
    })
    code: string;
    @Prop({
        required: true,
        type: Number,
    })
    value: number;
}
export const CouponSchema = SchemaFactory.createForClass(Coupon);
