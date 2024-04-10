import { Request, Response } from 'express';
import { BaseController } from '../../../common/models/BaseController';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { Controller } from '../../../decorators/Controller';
import { Delete, Get, Post, Put } from '../../../decorators/Methods';
import { Middlewares } from '../../../decorators/Middlewares';
import { Roles } from '../../../decorators/Roles';
import { CartItem, ShopCart, Store, StoreItem } from '../../../library/entity';
import { CartItemRepository, CartRepository, StockRepository, StoreRepository } from '../../../library/repository';
import { ActionLoger } from '../../../utils/ActionLoger';
import { StoreValidator } from './Store.validator';

@Controller('/store')
export class StoreController extends BaseController {
    /**
     * @swagger
     * /api/store:
     *   post:
     *     summary: Criar de Loja no banco
     *     tags: [Store]
     *     description: Criação de Registro de Loja no banco vinculado ao usuário criador
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: 'store_name'
     *               cnpj:
     *                 type: string
     *                 example: '62781317000160'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Post()
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.storeData())
    public async createStore(req: Request, res: Response): Promise<void> {
        const {
            name,
            cnpj,
            authentication: { userId: owner }
        } = req.body;

        const store = await new StoreRepository().create({ name, cnpj, owner });
        return RouteResponse.success(res, store);
    }

    /**
     * @swagger
     * /api/store/{storeId}:
     *   put:
     *     summary: Edição de dados de uma Loja
     *     tags: [Store]
     *     description: Edição de dados de uma Loja vinculada ao usuário
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
     *               name:
     *                 type: string
     *                 example: 'store_name'
     *               cnpj:
     *                 type: string
     *                 example: '62781317000160'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Put('/:storeId')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId, StoreValidator.storeData(), ActionLoger.logByRequest)
    public async updateStore(req: Request, res: Response): Promise<void> {
        const { storeId, cnpj, name } = req.body;

        const store = await new StoreRepository().update(storeId, { name, cnpj });
        RouteResponse.success(res, store);
    }

    /**
     * @swagger
     * /api/store/{storeId}:
     *   get:
     *     summary: Listagem de uma Loja específica
     *     tags: [Store]
     *     description: Listagem de uma Loja específica vinculadas ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *         description: Id da loja
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Get('/:storeId')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId)
    public async onlyId(req: Request, res: Response): Promise<void> {
        const { authentication, storeId } = req.body;

        const store = await new StoreRepository().findStoreById(authentication, storeId);
        return RouteResponse.success(res, store);
    }

    /**
     * @swagger
     * /api/store:
     *   get:
     *     summary: Listagem de Lojas
     *     tags: [Store]
     *     description: Lista Lojas vinculadas ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/page'
     *       - $ref: '#/components/parameters/size'
     *       - $ref: '#/components/parameters/order'
     *       - $ref: '#/components/parameters/orderBy'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Get()
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    public async listStores(req: Request, res: Response): Promise<void> {
        const { authentication } = req.body;
        const [rows, count] = await new StoreRepository().findStores(authentication, StoreController.getListParams(req));
        return RouteResponse.success(res, { rows, count });
    }

    /**
     * @swagger
     * /api/store/{storeId}:
     *   delete:
     *     summary: Deleção de Lojas
     *     tags: [Store]
     *     description: Deleção de Loja vinculada ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *         description: Id da loja
     *     responses:
     *       204:
     *         $ref: '#/components/responses/SuccessEmpty204'
     */
    @Delete('/:storeId')
    @Roles(EnumRoles.ADMIN)
    @Middlewares(StoreValidator.onlyId, ActionLoger.logByRequest)
    public async softDeleteStore(req: Request, res: Response): Promise<void> {
        const { storeId } = req.body;

        await new StoreRepository().softDelete(storeId);
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /api/store/{storeId}/stock:
     *   get:
     *     summary: Listagem do Estoque de uma Loja
     *     tags: [Store]
     *     description: Listagem do Estoque de uma Loja vinculada ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *       - $ref: '#/components/parameters/page'
     *       - $ref: '#/components/parameters/size'
     *       - $ref: '#/components/parameters/order'
     *       - $ref: '#/components/parameters/orderBy'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Get('/:storeId/stock')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId)
    public async getStoreStock(req: Request, res: Response): Promise<void> {
        const { storeId } = req.body;

        const stock = await new StockRepository().getStoreStock(storeId, StoreController.getListParams(req));
        const parsedStock = stock.map(item => ({ ...item, store: undefined }));

        return RouteResponse.success(res, { stock: parsedStock });
    }

    /**
     * @swagger
     * /api/store/{storeId}/stock/{storeItemId}:
     *   get:
     *     summary: Listagem de um Item do Estoque de uma Loja
     *     tags: [Store]
     *     description: Listagem de um Item do Estoque de uma Loja vinculada ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: storeItemId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Get('/:storeId/stock/:storeItemId')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId, StoreValidator.storeItemId)
    public async getStoreItem(req: Request, res: Response): Promise<void> {
        const { storeItemId } = req.body;

        const item = await new StockRepository().findById(storeItemId);
        const parsedItem = { ...item, store: undefined };

        return RouteResponse.success(res, { item: parsedItem });
    }

    /**
     * @swagger
     * /api/store/{storeId}/stock/{storeItemId}:
     *   put:
     *     summary: Atualiza um item de uma Loja
     *     tags: [Store]
     *     description: Atualiza um item de uma Loja vinculada ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: storeItemId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               quantity:
     *                 type: number
     *                 example: 10
     *               value:
     *                 type: number
     *                 example: 19.99
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Put('/:storeId/stock/:storeItemId')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId, StoreValidator.storeItemId, StoreValidator.storeItemData(), ActionLoger.logByRequest)
    public async updateStoreItem(req: Request, res: Response): Promise<void> {
        const { storeId, storeItemId: id, quantity, value } = req.body;

        const store = (await new StoreRepository().findById(storeId)) as Store;

        const storeItem = await new StockRepository().update(id, { store, quantity, value });

        const item = { ...storeItem, store: undefined };
        return RouteResponse.success(res, item);
    }

    /**
     * @swagger
     * /api/store/{storeId}/cart/{storeItemId}:
     *   post:
     *     summary: Adiciona um item ou altera a quantidade de um item ao Carrinho
     *     tags: [Store]
     *     description: Adiciona um item da loja ao carrinho ou altera a quantidade do item no carrinho
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: storeItemId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               quantity:
     *                 type: number
     *                 example: 10
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Post('/:storeId/cart/:storeItemId')
    @Roles(EnumRoles.USER, EnumRoles.ADMIN)
    @Middlewares(StoreValidator.onlyId, StoreValidator.storeItemId, StoreValidator.storeItemQuantity(), StoreValidator.hasCart)
    public async addOrUpdateQuantityItemToCart(req: Request, res: Response): Promise<void> {
        const { cartId, storeItemId, quantity } = req.body;

        try {
            const cartEntity = (await new CartRepository().findById(cartId)) as ShopCart;

            const storeItemEntity = (await new StockRepository().findById(storeItemId)) as StoreItem;

            await new CartItemRepository().addItemToCart(cartEntity, storeItemEntity, quantity);

            const cart = await new CartRepository().findById(cartId);
            const parsedCartItems = cart?.cartItems.map(item => ({ ...item, storeItem: { ...item.storeItem, store: undefined } }));

            return RouteResponse.success(res, { cart: { ...cart, cartItems: parsedCartItems } });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return RouteResponse.badRequest(res, err.message);
        }
    }

    /**
     * @swagger
     * /api/store/{storeId}/cart:
     *   get:
     *     summary: Lista o Carrinho e os Itens nele
     *     tags: [Store]
     *     description: Lista o Carrinho vinculado a loja e os itens vinculados a ele
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Get('/:storeId/cart')
    @Roles(EnumRoles.USER, EnumRoles.ADMIN)
    @Middlewares(StoreValidator.onlyId, StoreValidator.hasCart)
    public async getItemsFromCart(req: Request, res: Response): Promise<void> {
        const { cartId } = req.body;

        const cart = (await new CartRepository().findById(cartId)) as ShopCart;
        const parsedCart = { ...cart, cartItems: cart.cartItems.map(item => ({ ...item, storeItem: { ...item.storeItem, store: undefined } })) };

        return RouteResponse.success(res, { cart: parsedCart });
    }

    /**
     * @swagger
     * /api/store/{storeId}/cart/{cartItemId}:
     *   get:
     *     summary: Trazer o item específico do Carrinho
     *     tags: [Store]
     *     description: Trazer o item específico do Carrinho
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: cartItemId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Get('/:storeId/cart/:cartItemId')
    @Roles(EnumRoles.USER, EnumRoles.ADMIN)
    @Middlewares(StoreValidator.onlyId, StoreValidator.hasCart, StoreValidator.cartItemId())
    public async getItemFromCartByCartItemId(req: Request, res: Response): Promise<void> {
        const { cartItemId } = req.body;

        const cartItem = (await new CartItemRepository().findById(cartItemId)) as CartItem;
        const parsedCartItem = { ...cartItem, storeItem: { ...cartItem.storeItem, store: undefined } };

        return RouteResponse.success(res, parsedCartItem);
    }

    /**
     * @swagger
     * /api/store/{storeId}/cart/{cartItemId}:
     *   delete:
     *     summary: Remove um item do Carrinho
     *     tags: [Store]
     *     description: Remove um item do Carrinho vinculado a loja
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *       - in: path
     *         name: cartItemId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         $ref: '#/components/responses/SuccessEmpty204'
     */
    @Delete('/:storeId/cart/:cartItemId')
    @Roles(EnumRoles.USER, EnumRoles.ADMIN)
    @Middlewares(StoreValidator.onlyId, StoreValidator.hasCart, StoreValidator.cartItemId())
    public async removeItemFromCart(req: Request, res: Response): Promise<void> {
        const { cartItemId } = req.body;

        await new CartItemRepository().delete(cartItemId);

        return RouteResponse.successEmpty(res);
    }
}
