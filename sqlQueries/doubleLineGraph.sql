SELECT to_char("timeOfPurchase",'Mon') AS mon,
      "menuItems"."mealType",
      DATE_TRUNC('month', orders."timeOfPurchase" ) as m,
      EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
      SUM("revenue") AS "monthlyRevenue"
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
      sum(orders.revenue) as grandtotal,
      (select sum(orders.revenue)
      from orders
            join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id
            join "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
      where "menuItems"."mealType" = 'dinner') as sum_of_sum
from orders
      join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id
      join "menuItems" on "menuItems".id = "menuItemOrders"."menuItemId"
where "menuItems"."mealType" = 'dinner'
group by "menuItems"."mealType" , orders .revenue
limit 5;

     
     
     
     
     
     
     
     
     