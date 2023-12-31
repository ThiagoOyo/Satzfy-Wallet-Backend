const LndGrpc = require('lnd-grpc');
const dotenv = require('dotenv');

dotenv.config();

const options = {
    host: process.env.HOST,
    cert: process.env.CERT,
    macaroon: process.env.MACAROON
};

const grpc = new LndGrpc(options);

const connect = async () => {
    await grpc.connect();

    invoiceEventStream();
};

const getBalance = async () => {
    const balance = await grpc.services.Lightning.walletBalance();
    return balance;
};

const getChannelBalance = async () => {
    const channelBalance = await grpc.services.Lightning.channelBalance();
    return channelBalance;
};

const createInvoice = async ({value, memo}) => {
    const invoice = await grpc.services.Lightning.addInvoice({
        value: value,
        memo: memo,
    });

    return invoice;
};

const payInvoice = async ({payment_request}) => {
    const paidInvoice = await grpc.services.Lightning.sendPaymentSync({
        payment_request: payment_request,
    });

    return paidInvoice;
}

// This function creates a watcher on the invoice stream if you call on connect();
const invoiceEventStream = async () => {
    const invoiceStream = await grpc.services.Lightning.subscribeInvoices({
        add_index: 0,
        settle_index: 0,
    }).on('data', (invoice) => {
        console.log('invoice: ', invoice);

        if (data.settled) {
            console.log('Invoice settled');

            // save invoice tx to database
        }
    }).on('end', () => {
        console.log('Invoice stream ended');
    }).on('error', (err) => {
        console.log('Invoice stream error: ', err);
    });
}

module.exports = {
    connect, 
    grpc,
    getBalance,
    getChannelBalance,
    createInvoice,
    payInvoice
}
