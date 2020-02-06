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


select "menuName"  
from menus
where "beverageType" notnull ;


select "menuName"  
from menus
where "beverageType" = 'alcohol';

select "menuName"
from menus
where "mealType" = '${lunch}';

select distinct "menuName"
from menus
where "foodType" = '${foodType}';

select "menuName" , price 
from menus
order by price desc;

SELECT menus."menuName" as name,
sum("menuOrders" .quantity) as total
from "menuOrders"
join menus on menus.id = "menuOrders"."menuId"
group by name
order by total desc;



