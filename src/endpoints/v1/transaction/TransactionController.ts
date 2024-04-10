import { Request, Response } from 'express';
import { BaseController } from '../../../common/models/BaseController';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { Controller } from '../../../decorators/Controller';
import { Post } from '../../../decorators/Methods';
import { Middlewares } from '../../../decorators/Middlewares';
import { Roles } from '../../../decorators/Roles';
import { CartRepository, TransactionRepository } from '../../../library/repository';
import { StoreValidator } from '../store/Store.validator';
import { TransactionValidator } from './Transaction.validator';

@Controller('/transaction')
export class TransactionController extends BaseController {
    /**
     * @swagger
     * /api/transaction/{storeId}:
     *   post:
     *     summary: Criar Transação
     *     tags: [Transaction]
     *     description: Criação de Transação Referente a Carrinho vinculado a Loja
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *         description: Id da loja
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               transactionType:
     *                 type: string
     *     responses:
     *       204:
     *         $ref: '#/components/responses/SuccessEmpty204'
     */
    @Post('/:storeId')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId, TransactionValidator.transactionBody())
    public async createTransaction(req: Request, res: Response): Promise<void> {
        const { transactionType, storeId } = req.body;

        const cart = await new CartRepository().findByStoreId(storeId);

        if (!cart) return RouteResponse.badRequest(res, 'Cart not found');

        const transaction = await new TransactionRepository().createTransaction({
            transactionType,
            cart
        });

        await new CartRepository().closeCart(cart.id);

        return RouteResponse.success(res, { ...transaction, cart: undefined, total: transaction.total.toFixed(2) });
    }
}
