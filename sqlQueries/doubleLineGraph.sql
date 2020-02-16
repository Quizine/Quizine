SELECT to_char("timeOfPurchase",'Mon') AS mon,
	  menus."mealType",
      DATE_TRUNC('month', orders."timeOfPurchase" ) as m,
      EXTRACT(YEAR FROM "timeOfPurchase") AS yyyy,
      SUM("total") AS "monthlyRevenue"
      FROM orders
      join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id 
      join menus on menus.id = "menuItemOrders"."menuId" 
      WHERE orders."timeOfPurchase" >= NOW() - $1::interval 
      AND orders."restaurantId" = $2
      and menus."mealType" is not null
      GROUP BY mon, m, yyyy, menus."mealType" 
      ORDER BY m;



select menus."mealType",
sum(orders.total) as grandtotal,
(select sum(orders.total) 
from orders
join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id 
join menus on menus.id = "menuItemOrders"."menuId"
where menus."mealType" = 'dinner') as sum_of_sum
from orders
join "menuItemOrders" on "menuItemOrders"."orderId" = orders.id 
join menus on menus.id = "menuItemOrders"."menuId"
where menus."mealType" = 'dinner'
group by menus."mealType" , orders .total
limit 5;

     
     
     
     
     
     
     
     
     