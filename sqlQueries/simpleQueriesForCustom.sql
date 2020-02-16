SELECT
    COUNT(*)
FROM waiters
WHERE "updatedAt" > now() - interval
'1 month'
and waiters ."restaurantId" = '1' ;

select
    ROUND(avg(age))
from waiters
WHERE waiters ."restaurantId" = '1'
;

select
    ROUND(avg(age))
from waiters
where sex = 'male'
    and waiters ."restaurantId" = '1'
;

select
    ROUND(avg(age))
from waiters
where sex = 'female'
    and waiters ."restaurantId" = '1'
;


select "menuItemName"
from menus
where "beverageType"
notnull ;


select "menuItemName"
from menus
where "beverageType" = 'alcohol';

select "menuItemName"
from menus
where "mealType" = '${lunch}';

select distinct "menuItemName"
from menus
where "foodType" = '${foodType}';

select "menuItemName" , price
from menus
order by price desc;

SELECT menus."menuItemName" as name,
sum("menuItemOrders" .quantity) as total
from "menuItemOrders"
join menus on menus.id = "menuItemOrders"."menuId"
group by name
order by total desc;



