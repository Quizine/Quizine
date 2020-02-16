SELECT
COUNT(*)
FROM waiters
WHERE "updatedAt" > now() - interval '1 month'
and waiters ."restaurantId" = '1' ;

select
ROUND(avg(age))
from waiters
WHERE waiters ."restaurantId" = '1' ;

select 
ROUND(avg(age))
from waiters
where sex = 'male'
and waiters ."restaurantId" = '1' ;

select 
ROUND(avg(age))
from waiters
where sex = 'female'
and waiters ."restaurantId" = '1' ;


select "menuItem"  
from menus
where "beverageType" notnull ;


select "menuItem"  
from menus
where "beverageType" = 'alcohol';

select "menuItem"
from menus
where "mealType" = '${lunch}';

select distinct "menuItem"
from menus
where "foodType" = '${foodType}';

select "menuItem" , price 
from menus
order by price desc;

SELECT menus."menuItem" as name,
sum("menuItemOrders" .quantity) as total
from "menuItemOrders"
join menus on menus.id = "menuItemOrders"."menuId"
group by name
order by total desc;



