describe('core.model.Invoice', function() {
    var invoice, recipient1, recipient2;

    beforeEach(module('core.model'));

    beforeEach(inject(function ($injector) {
        var Invoice = $injector.get('Invoice');

        recipient1 = {
            firstname: 'firstname',
            lastname: 'lastname',
            address: {
                streetAddress: 'street-1',
                zipCode: '12345',
                city: 'city'
            },
            eInvoiceAddress: '124456789',
            eInvoiceOperator: {
                name: 'operator',
                eInvoiceAddress: '098765'
            }
        };

        recipient2 = {
            firstname: 'firstname-2',
            lastname: 'lastname-2',
            address: {
                streetAddress: 'street-2',
                zipCode: '12345',
                city: 'city'
            },
            eInvoiceAddress: null,
            eInvoiceOperator: null
        };

        invoice = Invoice.$new({
            date: '2012-01-01',
            paymentTerm: 5,
            dueDate: '2012-01-06',
            amount: 50000,
            description: 'foo',
            status: 'STATUS_DRAFT',
            eInvoiceAddress: null,
            eInvoiceOperator: null,
            recipients: [recipient1],
            invoiceRows: [{
                amount: 50000,
                discountPercent: 20,
                vatRate: { percent: 24 }
            }]
        });
    }));

    describe('isDraft', function() {
        it('should be true when status is draft', function () {
            expect(invoice.isDraft).toEqual(true);
        });

        it('should be false when status is not draft', function () {
            invoice.status = 'STATUS_PENDING';

            expect(invoice.isDraft).toEqual(false);
        });
    });

    describe('calculateDueDate()', function() {
        it('should update dueDate based on paymentTerm', function() {
            invoice.paymentTerm = 14;
            invoice.calculateDueDate();

            expect(invoice.dueDate).toBe('2012-01-14');
        });
    });

    describe('addRow()', function() {
        it('should add a row', function() {
            expect(invoice.invoiceRows.length).toBe(1);

            invoice.addRow({
                amount: 15000,
                discountPercent: 0,
                vatRate: { percent: 10 }
            });

            expect(invoice.invoiceRows.length).toBe(2);
        });

        it('should update invoice amount with row amount', function() {
            invoice.addRow({
                amount: 15000,
                discountPercent: 0,
                vatRate: { percent: 10 }
            });

            expect(invoice.amount).toBe(65000);
        });
    });

    describe('removeRow()', function() {
        it('should remove a row', function() {
            invoice.addRow({
                amount: 15000,
                discountPercent: 0,
                vatRate: { percent: 10 }
            });

            expect(invoice.invoiceRows.length).toBe(2);

            invoice.removeRow(invoice.invoiceRows[0]);

            expect(invoice.invoiceRows.length).toBe(1);
        });

        it('should update invoice amount after row has been removed', function() {
            invoice.addRow({
                amount: 15000,
                discountPercent: 0,
                vatRate: { percent: 10 }
            });

            expect(invoice.amount).toBe(65000);

            invoice.removeRow(invoice.invoiceRows[0]);

            expect(invoice.amount).toBe(15000);
        });
    });

    describe('setPrimaryRecipient()', function () {
        it('should set primary recipient', function () {
            invoice.setPrimaryRecipient(recipient1);

            expect(invoice.primaryRecipient).toBe(recipient1);
        });

        it('should populate address from primary recipient', function () {
            invoice.setPrimaryRecipient(recipient1);

            expect(invoice.streetAddress).toBe(recipient1.address.streetAddress);
            expect(invoice.zipCode).toBe(recipient1.address.zipCode);
            expect(invoice.city).toBe(recipient1.address.city);
        });

        it('should populate eInvoice info from primary recipient', function () {
            expect(invoice.sendAsEInvoice).toBe(false);

            invoice.setPrimaryRecipient(recipient1);

            expect(invoice.eInvoiceAddress).toBe(recipient1.eInvoiceAddress);
            expect(invoice.eInvoiceOperator).toBe(recipient1.eInvoiceOperator);
            expect(invoice.sendAsEInvoice).toBe(true);
        });

        it('should not send as eInvoice when recipient does not have eInvoice info', function () {
            invoice.setPrimaryRecipient(recipient2);

            expect(invoice.sendAsEInvoice).toBe(false);
        });
    });

    describe('isPrimaryRecipient()', function () {
        it('should return true for primary', function () {
            invoice.setPrimaryRecipient(recipient1);

            expect(invoice.isPrimaryRecipient(recipient1)).toBe(true);
            expect(invoice.isPrimaryRecipient(recipient2)).toBe(false);

            invoice.setPrimaryRecipient(recipient2);

            expect(invoice.isPrimaryRecipient(recipient1)).toBe(false);
            expect(invoice.isPrimaryRecipient(recipient2)).toBe(true);
        });
    });

    describe('addRecipient()', function () {
        it('should add a recipient', function () {
            expect(invoice.recipients.length).toBe(0);

            invoice.addRecipient(recipient1);

            expect(invoice.recipients.length).toBe(1);
        });

        it('should set primary recipient if not set before', function () {
            expect(invoice.primaryRecipient).toBeUndefined();

            invoice.addRecipient(recipient1);

            expect(invoice.primaryRecipient).toBe(recipient1);

            invoice.addRecipient(recipient2);

            expect(invoice.primaryRecipient).toBe(recipient1);
        });
    });

    describe('removeRecipient()', function () {
        it('should remove a recipient', function () {
            invoice.addRecipient(recipient1);

            expect(invoice.recipients.length).toBe(1);

            invoice.removeRecipient(recipient1);

            expect(invoice.recipients.length).toBe(0);
        });

        it('should reset primary recipient if the removed recipient was primary', function () {
            invoice.addRecipient(recipient1);
            invoice.addRecipient(recipient2);

            expect(invoice.primaryRecipient).toBe(recipient1);

            invoice.removeRecipient(recipient1);

            expect(invoice.primaryRecipient).toBe(recipient2);

            invoice.removeRecipient(recipient2);

            expect(invoice.primaryRecipient).toBe(null);
        });
    });

    it('should validate', function() {
        expect(invoice.isValid()).toBe(true);
    });

    describe('InvoiceRow', function () {
        var invoiceRow;
        beforeEach(function () {
            invoiceRow = invoice.invoiceRows[0];
        });

        it('should calculate total amount', function () {
            // 500 € 24 % vat & 20 % discount = 496 €
            expect(invoiceRow.total).toBe(49600);
        });

        describe('setDiscountType()', function () {
            it('should set discountType', function () {
                expect(invoiceRow.discountType).toBe('%');

                invoiceRow.setDiscountType('€');

                expect(invoiceRow.discountType).toBe('€');
            });

            it('should calculate euro based discount', function () {
                invoiceRow.setDiscountType('€');

                // 500 € 24 % vat = 620 € & 20 € discount = 600 €
                expect(invoiceRow.total).toBe(60000);
            });
        });

        describe('updateTotalAmount()', function () {
            it('should calculate total with new vat', function () {
                invoiceRow.vatRate = { percent: 10 };
                invoiceRow.updateTotalAmount();

                // 500 € 10 % vat & 20 % discount = 440 €
                expect(invoiceRow.total).toBe(44000);
            });

            it('should calculate total with new discount', function () {
                invoiceRow.discountValue = 50;
                invoiceRow.updateTotalAmount();

                // 500 € 24 % vat & 50 % discount = 310 €
                expect(invoiceRow.total).toBe(31000);
            });

            it('should calculate total without vat', function () {
                invoiceRow.updateTotalAmount();

                // 500 € 20 % discount = 400 €
                expect(invoiceRow.totalWithoutVat).toBe(40000);
            });
        });
    });
});
