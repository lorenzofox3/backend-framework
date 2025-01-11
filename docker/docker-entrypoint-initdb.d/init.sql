CREATE TABLE IF NOT EXISTS bank_accounts (
    bank_account_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    balance INTEGER NOT NULL CONSTRAINT positive_balance CHECK (balance > 0)
);

INSERT INTO bank_accounts (balance)
VALUES (10000),
       (10000);