--for calendar: https://www.npmjs.com/package/react-calendar
--revenue:
select
    sum(orders.total )
FROM orders
WHERE orders."timeOfPurchase" ::date = '2018-10-11';

--list of waiters on specific day:
select waiters."name"
from waiters
    join orders on orders."waiterId" = waiters.id
where orders."timeOfPurchase" ::date = '2018-10-11';

--most popular dish on a specific day: **still need by the date...
SELECT menus."menuItemName" as name,
sum("menuItemOrders" .quantity) as total
from "menuItemOrders"
join menus on menus.id = "menuItemOrders"."menuId"
join orders on orders.id = "menuItemOrders"."orderId" 
where orders."timeOfPurchase" ::date = '2018-10-11'
    and
    menus."beverageType"
isnull
group by name
order by total desc
limit 1;




