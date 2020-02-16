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
from "menuItems"
where "beverageType"
notnull ;


select "menuItemName"
from "menuItems"
where "beverageType" = 'alcohol';

select "menuItemName"
from "menuItems"
where "mealType" = '${lunch}';

select distinct "menuItemName"
from "menuItems"
where "foodType" = '${foodType}';

select "menuItemName" , price
from "menuItems"
order by price desc;

SELECT "menuItems"."menuItemName" as name,
    sum("menuOrders" .quantity) as total
from "menuOrders"
    join "menuItems" on "menuItems".id = "menuOrders"."menuItemId"
group by name
order by total desc;



