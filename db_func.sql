CREATE OR REPLACE FUNCTION decreaseCredit()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	update users set credit=credit-1 where id = NEW."subscriber";
    update users set credit = credit+1 where id = NEW."to";
	RETURN NEW;
END;
$$


CREATE TRIGGER subscription_added
  AFTER INSERT
  ON subscriptions
  FOR EACH ROW
  EXECUTE PROCEDURE decreaseCredit();