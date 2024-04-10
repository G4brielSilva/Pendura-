import { AuthenticationController } from './authentication/AuthenticationController';
import { ProductController } from './product/ProductController';
import { StoreController } from './store/StoreController';
import { TransactionController } from './transaction/TransactionController';

// prettier-ignore
export const v1 = [
    AuthenticationController,
    ProductController,
    StoreController,
    TransactionController
];

