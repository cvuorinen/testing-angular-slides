describe('core.model.Invoice', function() {
    var fixtureBuilder, invoiceRowFactory;

    beforeEach(module('core.model'));

    beforeEach(inject(function ($injector) {
        var Invoice = $injector.get('Invoice');
        fixtureBuilder = new FixtureBuilder($injector);

        invoiceRowFactory = function (amount, vat, discount) {
            return {
                amount: amount || 1000,
                discountPercent: discount || 0,
                vatRate: { percent: vat || 0 }
            };
        };
    }));

    describe('isDraft', function() {
        it('should be true when status is draft', function () {
            var invoice = fixtureBuilder.anInvoice()
                .withStatus('STATUS_DRAFT').build();

            expect(invoice.isDraft).toEqual(true);
        });

        it('should be false when status is not draft', function () {
            var invoice = fixtureBuilder.anInvoice()
                .withStatus('STATUS_PENDING').build();

            expect(invoice.isDraft).toEqual(false);
        });
    });

    describe('calculateDueDate()', function() {
        it('should update dueDate based on date and paymentTerms', function() {
            var invoice = fixtureBuilder.anInvoice()
                .withDate('2016-01-01').build();

            invoice.paymentTerm = 10;
            invoice.calculateDueDate();

            expect(invoice.dueDate).toBe('2016-01-11');
        });
    });

    describe('addRow()', function() {
        it('should add a row', function() {
            var invoice = fixtureBuilder.anInvoice().build();

            invoice.addRow(invoiceRowFactory());

            expect(invoice.invoiceRows.length).toBe(1);
        });

        it('should update invoice amount with row amount', function() {
            var invoice = fixtureBuilder.anInvoice().build();
            var row1 = invoiceRowFactory(50000);
            var row2 = invoiceRowFactory(15000);

            invoice.addRow(row1);

            expect(invoice.amount).toBe(row1.amount);

            invoice.addRow(row2);

            expect(invoice.amount).toBe(row1.amount + row2.amount);
        });
    });

    describe('removeRow()', function() {
        it('should remove a row', function() {
            var invoice = fixtureBuilder.anInvoice().build();
            invoice.addRow(invoiceRowFactory());

            expect(invoice.invoiceRows.length).toBe(1);

            invoice.removeRow(invoice.invoiceRows[0]);

            expect(invoice.invoiceRows.length).toBe(0);
        });

        it('should update invoice amount after row has been removed', function() {
            var invoice = fixtureBuilder.anInvoice().build();
            var row = invoiceRowFactory(5000);
            invoice.addRow(row);

            expect(invoice.amount).toBe(row.amount);

            invoice.removeRow(invoice.invoiceRows[0]);

            expect(invoice.amount).toBe(0);
        });
    });

    describe('setPrimaryRecipient()', function () {
        var recipient;

        beforeEach(function () {
            recipient = fixtureBuilder.aCompany()
                .withAddress({
                    streetAddress: 'street-2',
                    zipCode: 'zip-2',
                    city: 'city-2'
                })
                .withEInvoiceAddress('124456789')
                .withEInvoiceOperator({
                    name: 'operator',
                    eInvoiceAddress: '098765'
                })
                .build();
        });

        it('should set primary recipient', function () {
            var invoice = fixtureBuilder.anInvoice().build();
            expect(invoice.primaryRecipient).toBeUndefined();

            invoice.setPrimaryRecipient(recipient);

            expect(invoice.primaryRecipient).toBe(recipient);
        });

        it('should populate address from primary recipient', function () {
            var invoice = fixtureBuilder.anInvoice().build();
            invoice.setPrimaryRecipient(recipient);

            expect(invoice.streetAddress).toBe(recipient.address.streetAddress);
            expect(invoice.zipCode).toBe(recipient.address.zipCode);
            expect(invoice.city).toBe(recipient.address.city);
        });

        it('should populate eInvoice info from primary recipient', function () {
            var invoice = fixtureBuilder.anInvoice().build();
            expect(invoice.sendAsEInvoice).toBe(false);

            invoice.setPrimaryRecipient(recipient);

            expect(invoice.eInvoiceAddress).toBe(recipient.eInvoiceAddress);
            expect(invoice.eInvoiceOperator).toBe(recipient.eInvoiceOperator);
            expect(invoice.sendAsEInvoice).toBe(true);
        });

        it('should not send as eInvoice when recipient does not have eInvoice info', function () {
            var invoice = fixtureBuilder.anInvoice().build();
            invoice.setPrimaryRecipient(recipient2);

            expect(invoice.sendAsEInvoice).toBe(false);
        });
    });

    describe('isPrimaryRecipient()', function () {
        it('should return true for primary', function () {
            var invoice = fixtureBuilder.anInvoice().build();
            var recipient1 = fixtureBuilder.aCompany().build();
            var recipient2 = fixtureBuilder.aPerson().build();

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
            var invoice = fixtureBuilder.anInvoice().build();
            expect(invoice.recipients.length).toBe(0);

            invoice.addRecipient(fixtureBuilder.aPerson().build());

            expect(invoice.recipients.length).toBe(1);
        });

        it('should set primary recipient if not set before', function () {
            var invoice = fixtureBuilder.anInvoice().build();
            var recipient1 = fixtureBuilder.aCompany().build();
            var recipient2 = fixtureBuilder.aPerson().build();
            expect(invoice.primaryRecipient).toBeUndefined();

            invoice.addRecipient(recipient1);

            expect(invoice.primaryRecipient).toBe(recipient1);

            invoice.addRecipient(recipient2);

            expect(invoice.primaryRecipient).toBe(recipient1);
        });
    });

    describe('removeRecipient()', function () {
        it('should remove a recipient', function () {
            var invoice = fixtureBuilder.anInvoice().build();
            var recipient = fixtureBuilder.aPerson().build();

            invoice.addRecipient(recipient);

            expect(invoice.recipients.length).toBe(1);

            invoice.removeRecipient(recipient);

            expect(invoice.recipients.length).toBe(0);
        });

        it('should reset primary recipient if the removed recipient was primary', function () {
            var invoice = fixtureBuilder.anInvoice().build();
            var recipient1 = fixtureBuilder.aCompany().build();
            var recipient2 = fixtureBuilder.aPerson().build();

            invoice.addRecipient(recipient1);
            invoice.addRecipient(recipient2);

            expect(invoice.primaryRecipient).toBe(recipient1);

            invoice.removeRecipient(recipient1);

            expect(invoice.primaryRecipient).toBe(recipient2);

            invoice.removeRecipient(recipient2);

            expect(invoice.primaryRecipient).toBe(null);
        });
    });

    describe('isValid()', function() {
        it('should validate invoice', function() {
            using('invoiceProvider', invoiceProvider(), function (data) {
                expect(data.invoice.isValid()).toBe(data.isValid);
            });
        });

        function invoiceProvider() {
            return [
                {
                    invoice: fixtureBuilder.anInvoice().build(),
                    isValid: true
                },
                {
                    invoice: fixtureBuilder.anInvoice()
                        .withoutInvoiceRows().build(),
                    isValid: false
                },
                {
                    invoice: fixtureBuilder.anInvoice()
                        .withoutRecipients().build(),
                    isValid: false
                },
                {
                    invoice: fixtureBuilder.anInvoice()
                        .withoutPaymentTerm().build(),
                    isValid: false
                },
                {
                    invoice: fixtureBuilder.anInvoice()
                        .withoutDate().build(),
                    isValid: false
                }
            ];
        }
    });

    describe('InvoiceRow', function () {
        var rowData, invoiceRow;
        beforeEach(function () {
            rowData = invoiceRowFactory(50000, 24, 20);
            var invoice = fixtureBuilder.anInvoice()
                .withRows([rowData])
                .build();

            invoiceRow = invoice.invoiceRows[0];
        });

        it('should calculate total amount', function () {
            // 500 € 24 % vat & 20 % discount = 496 €
            expect(invoiceRow.total).toBe(496 * 100);
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
                expect(invoiceRow.total).toBe(600 * 100);
            });
        });

        describe('updateTotalAmount()', function () {
            it('should calculate total with new vat', function () {
                invoiceRow.vatRate = { percent: 10 };
                invoiceRow.updateTotalAmount();

                // 500 € 10 % vat & 20 % discount = 440 €
                expect(invoiceRow.total).toBe(440 * 100);
            });

            it('should calculate total with new discount', function () {
                invoiceRow.discountValue = 50;
                invoiceRow.updateTotalAmount();

                // 500 € 24 % vat & 50 % discount = 310 €
                expect(invoiceRow.total).toBe(310 * 100);
            });

            it('should calculate total without vat', function () {
                invoiceRow.updateTotalAmount();

                // 500 € 20 % discount = 400 €
                expect(invoiceRow.totalWithoutVat).toBe(400 * 100);
            });
        });
    });
});
