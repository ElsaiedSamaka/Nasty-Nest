import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  versionKey: false,
})
export class BaseEntity {
  @Prop({ type: String, required: true })
  name: string;
}

export const TranslationSchema = SchemaFactory.createForClass(BaseEntity);
