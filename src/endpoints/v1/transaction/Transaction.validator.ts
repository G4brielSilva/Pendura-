/* eslint-disable no-plusplus */
import { RequestHandler } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { EnumTransactions } from '../../../common/models/enum/EnumTransactions';

export class TransactionValidator extends BaseValidator {
    /**
     * transactionBody - Valida tipo de transação
     * @return { Array<RequestHandler> }
     */
    public static transactionBody(): Array<RequestHandler> {
        return TransactionValidator.validationList({
            transactionType: {
                in: 'body',
                isString: true,
                isIn: {
                    options: [Object.values(EnumTransactions)]
                },
                errorMessage: 'transactionType is invalid'
            }
        });
    }
}
