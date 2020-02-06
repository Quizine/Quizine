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
SELECT menus."menuName" as name,
sum("menuOrders" .quantity) as total
from "menuOrders"
join menus on menus.id = "menuOrders"."menuId"
join orders on orders.id = "menuOrders"."orderId" 
where orders."timeOfPurchase" ::date = '2018-10-11'
group by name
order by total desc
limit 1;




