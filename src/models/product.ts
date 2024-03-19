import { Column, Entity } from 'typeorm';
import { Product as MedusaProduct } from '@medusajs/medusa';

@Entity()
export class Product extends MedusaProduct {
	@Column({ nullable: true })
	gender: string;
	@Column({ default: false, nullable: true, type: 'boolean' })
	is_external: boolean;
}
