SELECT to_char("timeOfPurchase",'Mon') AS mon,
      "menuItems"."mealType",
      DATE_TRUNC('month', orders."timeOfPurchase" ) as m,
      EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
      SUM("total") AS "monthlyRevenue"
FROM orders
      join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id
      join "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
WHERE orders."timeOfPurchase" >= NOW() - $1
::interval 
      AND orders."restaurantId" = $2
      and "menuItems"."mealType" is not null
      GROUP BY mon, m, yyyy, "menuItems"."mealType" 
      ORDER BY m;



select "menuItems"."mealType",
      sum(orders.total) as grandtotal,
      (select sum(orders.total)
      from orders
            join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id
            join "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
      where "menuItems"."mealType" = 'dinner') as sum_of_sum
from orders
      join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id
      join "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
where "menuItems"."mealType" = 'dinner'
group by "menuItems"."mealType" , orders .total
limit 5;

     
     
     
     
     
     
     
     
     