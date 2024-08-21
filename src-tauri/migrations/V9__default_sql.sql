DROP INDEX IF EXISTS poc_ddl_ddl_name_IDX;
ALTER TABLE poc_case ADD COLUMN case_description TEXT; 
ALTER TABLE poc_case ADD COLUMN case_order INTEGER DEFAULT(1); 
CREATE INDEX IF NOT EXISTS poc_ddl_ddl_name_category_id_IDX ON poc_ddl (ddl_name,category_id);

INSERT INTO poc_ddl (ddl_name,category_id,ddl_content) VALUES
	 ('ddl-oltp',1,'DROP TABLE IF EXISTS "poc_brands";

CREATE TABLE poc_brands (
	"brand_id" int8 NOT NULL,
	"brand_name" varchar(128) NOT NULL,
	"logo_url" varchar(255) NULL,
	"description" text NULL,
	"created_at" timestamp DEFAULT now() NULL
)
DISTRIBUTE by replication;

-- 为表添加注释
COMMENT ON TABLE poc_brands IS ''品牌信息表'';

-- 为字段添加注释
COMMENT ON COLUMN poc_brands.brand_id IS ''品牌ID，作为主键'';
COMMENT ON COLUMN poc_brands.brand_name IS ''品牌名称'';
COMMENT ON COLUMN poc_brands.logo_url IS ''品牌Logo的URL'';
COMMENT ON COLUMN poc_brands.description IS ''品牌描述'';
COMMENT ON COLUMN poc_brands.created_at IS ''创建时间，记录品牌何时被添加到数据库中'';


CREATE TABLE poc_sellers (
	"seller_id" int8 NOT NULL,
	"seller_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20) NULL,
	"password" varchar(255) NOT NULL,
	"registration_date" timestamp DEFAULT now() NULL,
	"last_login_date" timestamp NULL,
	"address" varchar(255) NULL,
	"zip_code" varchar(10) NULL,
	"country" varchar(100) NULL,
	"business_type" varchar(100) NULL,
	"company_name" varchar(255) NULL,
	"status" varchar(50) DEFAULT ''active''::character varying NULL,
	"created_at" timestamp DEFAULT now() NULL
)
DISTRIBUTE by hash(seller_id);

COMMENT ON TABLE poc_sellers IS ''卖家信息表'';  
COMMENT ON COLUMN poc_sellers.seller_id IS ''卖家ID，作为主键'';  
COMMENT ON COLUMN poc_sellers.seller_name IS ''卖家名称或昵称'';  
COMMENT ON COLUMN poc_sellers.email IS ''卖家电子邮箱，确保唯一性'';  
COMMENT ON COLUMN poc_sellers.phone_number IS ''卖家电话号码'';  
COMMENT ON COLUMN poc_sellers.password IS ''卖家密码（注意：实际应用中应加密存储）'';  
COMMENT ON COLUMN poc_sellers.registration_date IS ''注册日期'';  
COMMENT ON COLUMN poc_sellers.last_login_date IS ''最近登录日期'';  
COMMENT ON COLUMN poc_sellers.address IS ''卖家地址'';  
COMMENT ON COLUMN poc_sellers.zip_code IS ''邮政编码'';  
COMMENT ON COLUMN poc_sellers.country IS ''国家'';  
COMMENT ON COLUMN poc_sellers.business_type IS ''业务类型（如个人、企业等）'';  
COMMENT ON COLUMN poc_sellers.company_name IS ''如果卖家是企业，则为公司名称'';  
COMMENT ON COLUMN poc_sellers.status IS ''卖家状态（如活跃、禁用等），默认为active'';



DROP TABLE IF EXISTS "poc_category";

CREATE TABLE poc_category (
  "category_id" int8 NOT NULL,
  "name" varchar(100) NOT NULL,
  "description" text,
  "parent_id" int8,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "status" bool NOT NULL,
  "image_url" varchar(255),
  "seo_title" varchar(255),
  "seo_description" varchar(255),
  "seo_keywords" varchar(255),
  "level" int4,
  "path" varchar(255),
  "sort_order" int4,
  "is_featured" bool,
  "notes" text,
  CONSTRAINT poc_category_pkey PRIMARY KEY (category_id)
)
DISTRIBUTE by replication;

COMMENT ON TABLE poc_category IS ''商品分类字典表'';
COMMENT ON COLUMN poc_category.category_id IS ''分类ID'';
COMMENT ON COLUMN poc_category.name IS ''分类名称'';
COMMENT ON COLUMN poc_category.description IS ''分类描述'';
COMMENT ON COLUMN poc_category.parent_id IS ''父级分类ID'';
COMMENT ON COLUMN poc_category.created_at IS ''创建时间'';
COMMENT ON COLUMN poc_category.updated_at IS ''更新时间'';
COMMENT ON COLUMN poc_category.status IS ''状态（1：激活，0：禁用）'';
COMMENT ON COLUMN poc_category.image_url IS ''分类图片URL'';
COMMENT ON COLUMN poc_category.seo_title IS ''SEO标题'';
COMMENT ON COLUMN poc_category.seo_description IS ''SEO描述'';
COMMENT ON COLUMN poc_category.seo_keywords IS ''SEO关键词'';
COMMENT ON COLUMN poc_category.level IS ''分类级别'';
COMMENT ON COLUMN poc_category.path IS ''分类路径'';
COMMENT ON COLUMN poc_category.sort_order IS ''排序顺序'';
COMMENT ON COLUMN poc_category.is_featured IS ''是否推荐分类（1：是，0：否）'';
COMMENT ON COLUMN poc_category.notes IS ''备注'';

DROP TABLE IF EXISTS "poc_product";
CREATE TABLE poc_product (
  "product_id" int8 NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "price" decimal(10,2) NOT NULL,
  "category_id" int8 NOT NULL,
  "stock" int8 NOT NULL,
  "sold" int8,
  "rating" decimal(3,2),
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "status" bool NOT NULL,
  "image_url" varchar(255),
  "shipping_cost" decimal(10,2),
  "origin_country" varchar(50),
  "weight" decimal(5,2),
  "dimensions" varchar(100),
  "color" varchar(30),
  "material" varchar(50),
  "brand_id" int8,
  "brand" varchar(50),
  "warranty_period" int4,
  "return_policy" varchar(255),
  "seller_id" int8,
  "discount" decimal(5,2),
  "discount_start_date" timestamp,
  "discount_end_date" timestamp,
  "seo_title" varchar(255),
  "seo_description" varchar(255),
  "seo_keywords" varchar(255),
  "views" int4,
  "notes" text,
  CONSTRAINT pro_product_pkey PRIMARY KEY (product_id)
)
DISTRIBUTE BY HASH(product_id);
COMMENT ON TABLE poc_product IS ''商品表'';
COMMENT ON COLUMN poc_product.product_id IS ''商品ID'';
COMMENT ON COLUMN poc_product.name IS ''商品名称'';
COMMENT ON COLUMN poc_product.description IS ''商品描述'';
COMMENT ON COLUMN poc_product.price IS ''价格'';
COMMENT ON COLUMN poc_product.category_id IS ''分类ID'';
COMMENT ON COLUMN poc_product.stock IS ''库存量'';
COMMENT ON COLUMN poc_product.sold IS ''已售数量'';
COMMENT ON COLUMN poc_product.rating IS ''评分'';
COMMENT ON COLUMN poc_product.created_at IS ''创建时间'';
COMMENT ON COLUMN poc_product.updated_at IS ''更新时间'';
COMMENT ON COLUMN poc_product.status IS ''状态（1：上架，0：下架）'';
COMMENT ON COLUMN poc_product.image_url IS ''商品图片URL'';
COMMENT ON COLUMN poc_product.shipping_cost IS ''运费'';
COMMENT ON COLUMN poc_product.origin_country IS ''产地国家'';
COMMENT ON COLUMN poc_product.weight IS ''重量（kg）'';
COMMENT ON COLUMN poc_product.dimensions IS ''尺寸（长x宽x高）'';
COMMENT ON COLUMN poc_product.color IS ''颜色'';
COMMENT ON COLUMN poc_product.material IS ''材质'';
COMMENT ON COLUMN poc_product.brand IS ''品牌'';
COMMENT ON COLUMN poc_product.warranty_period IS ''保修期（月）'';
COMMENT ON COLUMN poc_product.return_policy IS ''退货政策'';
COMMENT ON COLUMN poc_product.seller_id IS ''卖家ID'';
COMMENT ON COLUMN poc_product.discount IS ''折扣'';
COMMENT ON COLUMN poc_product.discount_start_date IS ''折扣开始时间'';
COMMENT ON COLUMN poc_product.discount_end_date IS ''折扣结束时间'';
COMMENT ON COLUMN poc_product.seo_title IS ''SEO标题'';
COMMENT ON COLUMN poc_product.seo_description IS ''SEO描述'';
COMMENT ON COLUMN poc_product.seo_keywords IS ''SEO关键词'';
COMMENT ON COLUMN poc_product.views IS ''浏览量'';
COMMENT ON COLUMN poc_product.notes IS ''备注'';

DROP TABLE IF EXISTS "poc_order";

CREATE TABLE poc_order (
  "order_id" int8 NOT NULL,
  "user_id" int8 NOT NULL,
  "product_id" int8 NOT NULL,
  "total_price" decimal(10,2) NOT NULL,
  "status" int4 NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "payment_method" varchar(50) NOT NULL,
  "shipping_address" varchar(255) NOT NULL,
  "shipping_cost" decimal(10,2) NOT NULL,
  "discount" decimal(10,2),
  "coupon_code" varchar(50),
  "notes" text,
  "tracking_number" varchar(100),
  "estimated_delivery_date" timestamp,
  "actual_delivery_date" timestamp,
  "cancel_reason" varchar(255),
  "payment_date" timestamp,
  "shipment_date" timestamp,
  "completion_date" timestamp,
  "customer_service_contact" varchar(255),
  "refund_amount" decimal(10,2),
  "refund_reason" varchar(255),
  "refund_date" timestamp,
  "review" json,
  "product_count" int8 NOT NULL,
  "ip_address" varchar(50),
  "send_ip" varchar(100),
  "receive_ip" varchar(100),
  "send_port" varchar(100),
  "receive_port" varchar(100),
  "send_time" timestamp,
  "receive_time" timestamp,
  CONSTRAINT poc_order_pkey PRIMARY KEY (order_id, product_id)
)
DISTRIBUTE by hash(product_id)
partition by range (created_at)
(
	partition p202401 values LESS THAN (''2024-02-01 00:00:00''),
	partition p202402 values LESS THAN (''2024-03-01 00:00:00''),
	partition p202403 values LESS THAN (''2024-04-01 00:00:00''),
	partition p202404 values LESS THAN (''2024-05-01 00:00:00'')
);

COMMENT ON TABLE poc_order IS ''订单表'';
COMMENT ON COLUMN poc_order.order_id IS ''订单ID'';
COMMENT ON COLUMN poc_order.user_id IS ''用户ID'';
COMMENT ON COLUMN poc_order.product_id IS ''商品ID'';
COMMENT ON COLUMN poc_order.total_price IS ''订单总价'';
COMMENT ON COLUMN poc_order.status IS ''订单状态（1：待支付，2：已支付，3：发货中，4：已完成，5：已取消）'';
COMMENT ON COLUMN poc_order.created_at IS ''创建时间'';
COMMENT ON COLUMN poc_order.updated_at IS ''更新时间'';
COMMENT ON COLUMN poc_order.payment_method IS ''支付方式'';
COMMENT ON COLUMN poc_order.shipping_address IS ''收货地址'';
COMMENT ON COLUMN poc_order.shipping_cost IS ''运费'';
COMMENT ON COLUMN poc_order.discount IS ''折扣金额'';
COMMENT ON COLUMN poc_order.coupon_code IS ''使用的优惠券代码'';
COMMENT ON COLUMN poc_order.notes IS ''订单备注'';
COMMENT ON COLUMN poc_order.tracking_number IS ''物流跟踪号'';
COMMENT ON COLUMN poc_order.estimated_delivery_date IS ''预计送达时间'';
COMMENT ON COLUMN poc_order.actual_delivery_date IS ''实际送达时间'';
COMMENT ON COLUMN poc_order.cancel_reason IS ''取消原因'';
COMMENT ON COLUMN poc_order.payment_date IS ''支付时间'';
COMMENT ON COLUMN poc_order.shipment_date IS ''发货时间'';
COMMENT ON COLUMN poc_order.completion_date IS ''完成时间'';
COMMENT ON COLUMN poc_order.customer_service_contact IS ''客服联系方式'';
COMMENT ON COLUMN poc_order.refund_amount IS ''退款金额'';
COMMENT ON COLUMN poc_order.refund_reason IS ''退款原因'';
COMMENT ON COLUMN poc_order.refund_date IS ''退款时间'';
COMMENT ON COLUMN poc_order.review IS ''订单评价{time: , content: }'';
COMMENT ON COLUMN poc_order.product_count IS ''商品数量'';
COMMENT ON COLUMN poc_order.ip_address IS ''下单时的IP地址'';
COMMENT ON COLUMN poc_order.send_ip IS ''send_ip'';
COMMENT ON COLUMN poc_order.receive_ip IS ''receive_ip'';
COMMENT ON COLUMN poc_order.send_port IS ''send_port'';
COMMENT ON COLUMN poc_order.receive_port IS ''receive_port'';
COMMENT ON COLUMN poc_order.send_time IS ''send_time'';
COMMENT ON COLUMN poc_order.receive_time IS ''receive_time'';

DROP TABLE IF EXISTS "poc_user";

CREATE TABLE poc_user (
  "user_id" int8 NOT NULL,
  "username" varchar(50) NOT NULL,
  "password" varchar(255) NOT NULL,
  "email" varchar(100) NOT NULL,
  "phone_number" varchar(20),
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL,
  "last_login" timestamp,
  "last_login_ip" varchar(20) NOT NULL,
  "profile_picture" varchar(255),
  "birthday" date,
  "gender" int4,
  "country" varchar(50),
  "state" varchar(50),
  "city" varchar(50),
  "address" varchar(255),
  "zip_code" varchar(10),
  "reward_points" int8,
  "account_balance" decimal(10,2),
  "is_email_verified" int4,
  "is_phone_verified" int4,
  "security_question" varchar(255),
  "security_answer" varchar(255),
  "notes" text,
  "preferences" text,
  "login_attempts" int4,
  "lockout_time" timestamp,
  CONSTRAINT poc_user_pkey PRIMARY KEY (user_id)
)
DISTRIBUTE BY HASH(user_id);
COMMENT ON TABLE poc_user IS ''用户表'';
COMMENT ON COLUMN poc_user.user_id IS ''用户ID'';
COMMENT ON COLUMN poc_user.username IS ''用户名'';
COMMENT ON COLUMN poc_user.password IS ''密码'';
COMMENT ON COLUMN poc_user.email IS ''电子邮箱'';
COMMENT ON COLUMN poc_user.phone_number IS ''电话号码'';
COMMENT ON COLUMN poc_user.created_at IS ''创建时间'';
COMMENT ON COLUMN poc_user.updated_at IS ''更新时间'';
COMMENT ON COLUMN poc_user.last_login IS ''最后登录时间'';
COMMENT ON COLUMN poc_user.last_login_ip IS ''最后登录IP,检测IP段，异地登录'';
COMMENT ON COLUMN poc_user.profile_picture IS ''头像URL'';
COMMENT ON COLUMN poc_user.birthday IS ''生日'';
COMMENT ON COLUMN poc_user.gender IS ''性别（1：男，2：女，0：未知）'';
COMMENT ON COLUMN poc_user.country IS ''国家'';
COMMENT ON COLUMN poc_user.state IS ''州/省'';
COMMENT ON COLUMN poc_user.city IS ''城市'';
COMMENT ON COLUMN poc_user.address IS ''地址'';
COMMENT ON COLUMN poc_user.zip_code IS ''邮政编码'';
COMMENT ON COLUMN poc_user.reward_points IS ''奖励积分'';
COMMENT ON COLUMN poc_user.account_balance IS ''账户余额'';
COMMENT ON COLUMN poc_user.is_email_verified IS ''邮箱是否验证（1：是，0：否）'';
COMMENT ON COLUMN poc_user.is_phone_verified IS ''电话是否验证（1：是，0：否）'';
COMMENT ON COLUMN poc_user.security_question IS ''安全问题'';
COMMENT ON COLUMN poc_user.security_answer IS ''安全问题答案'';
COMMENT ON COLUMN poc_user.notes IS ''备注'';
COMMENT ON COLUMN poc_user.preferences IS ''偏好设置'';
COMMENT ON COLUMN poc_user.login_attempts IS ''登录尝试次数'';
COMMENT ON COLUMN poc_user.lockout_time IS ''账户锁定时间'';

DROP TABLE IF EXISTS "poc_product_user_relation";

CREATE TABLE poc_product_user_relation (
  "relation_id" int8 NOT NULL,
  "product_id" int8 NOT NULL,
  "user_id" int8 NOT NULL,
  "created_at" timestamp NOT NULL,
  CONSTRAINT proc_product_user_relation_pkey PRIMARY KEY (product_id,user_id)
)
DISTRIBUTE BY HASH(product_id,user_id);
COMMENT ON TABLE poc_product_user_relation IS ''用户商品关系表'';
COMMENT ON COLUMN poc_product_user_relation.relation_id IS ''关系ID'';
COMMENT ON COLUMN poc_product_user_relation.product_id IS ''商品ID'';
COMMENT ON COLUMN poc_product_user_relation.user_id IS ''用户ID'';
COMMENT ON COLUMN poc_product_user_relation.created_at IS ''创建时间'';');


INSERT INTO poc_ddl (ddl_name,category_id,ddl_content) VALUES ('ddl-olap',1,'DROP TABLE IF EXISTS "poc_brands";

CREATE TABLE poc_brands (
	"brand_id" int8 NOT NULL,
	"brand_name" varchar(128) NOT NULL,
	"logo_url" varchar(255) NULL,
	"description" text NULL,
	"created_at" timestamp DEFAULT now() NULL
)
WITH (
	orientation=column,
	compression=middle
)
distribute by replication;

-- 为表添加注释
COMMENT ON TABLE poc_brands IS ''品牌信息表'';

-- 为字段添加注释
COMMENT ON COLUMN poc_brands.brand_id IS ''品牌ID，作为主键'';
COMMENT ON COLUMN poc_brands.brand_name IS ''品牌名称'';
COMMENT ON COLUMN poc_brands.logo_url IS ''品牌Logo的URL'';
COMMENT ON COLUMN poc_brands.description IS ''品牌描述'';
COMMENT ON COLUMN poc_brands.created_at IS ''创建时间，记录品牌何时被添加到数据库中'';


-- poc_category definition

-- Drop table

DROP TABLE IF EXISTS "poc_category";

CREATE TABLE poc_category (
	"category_id" int8 NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NULL,
	"parent_id" int8 NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"status" bool NOT NULL,
	"image_url" varchar(255) NULL,
	"seo_title" varchar(255) NULL,
	"seo_description" varchar(255) NULL,
	"seo_keywords" varchar(255) NULL,
	"level" int4 NULL,
	"path" varchar(255) NULL,
	"sort_order" int4 NULL,
	"is_featured" bool NULL,
	"notes" text NULL
)
WITH (
	orientation=column,
	compression=middle
) distribute by replication;

COMMENT ON COLUMN "poc_category"."category_id" IS ''分类ID'';
COMMENT ON COLUMN "poc_category"."name" IS ''分类名称'';
COMMENT ON COLUMN "poc_category"."description" IS ''分类描述'';
COMMENT ON COLUMN "poc_category"."parent_id" IS ''父级分类ID'';
COMMENT ON COLUMN "poc_category"."created_at" IS ''创建时间'';
COMMENT ON COLUMN "poc_category"."updated_at" IS ''更新时间'';
COMMENT ON COLUMN "poc_category"."status" IS ''状态（1：激活，0：禁用）'';
COMMENT ON COLUMN "poc_category"."image_url" IS ''分类图片URL'';
COMMENT ON COLUMN "poc_category"."seo_title" IS ''SEO标题'';
COMMENT ON COLUMN "poc_category"."seo_description" IS ''SEO描述'';
COMMENT ON COLUMN "poc_category"."seo_keywords" IS ''SEO关键词'';
COMMENT ON COLUMN "poc_category"."level" IS ''分类级别'';
COMMENT ON COLUMN "poc_category"."path" IS ''分类路径'';
COMMENT ON COLUMN "poc_category"."sort_order" IS ''排序顺序'';
COMMENT ON COLUMN "poc_category"."is_featured" IS ''是否推荐分类（1：是，0：否）'';
COMMENT ON COLUMN "poc_category"."notes" IS ''备注'';
COMMENT ON TABLE "poc_category" IS ''商品分类字典表'';

-- poc_order definition

-- Drop table

DROP TABLE IF EXISTS "poc_order";

CREATE TABLE poc_order (
	"order_id" int8 NOT NULL,
	"user_id" int8 NOT NULL,
	"product_id" int8 NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" int4 NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"shipping_address" varchar(255) NOT NULL,
	"shipping_cost" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) NULL,
	"coupon_code" varchar(50) NULL,
	"notes" text NULL,
	"tracking_number" varchar(100) NULL,
	"estimated_delivery_date" timestamp(6) NULL,
	"actual_delivery_date" timestamp(6) NULL,
	"cancel_reason" varchar(255) NULL,
	"payment_date" timestamp(6) NULL,
	"shipment_date" timestamp(6) NULL,
	"completion_date" timestamp(6) NULL,
	"customer_service_contact" varchar(255) NULL,
	"refund_amount" numeric(10, 2) NULL,
	"refund_reason" varchar(255) NULL,
	"refund_date" timestamp(6) NULL,
	"review" varchar(255) NULL,
	"product_count" int8 NOT NULL,
	"ip_address" varchar(50) NULL,
	"send_ip" varchar(100) NULL,
	"receive_ip" varchar(100) NULL,
	"send_port" varchar(100) NULL,
	"receive_port" varchar(100) NULL,
	"send_time" timestamp(6) NULL,
	"receive_time" timestamp(6) NULL
)
WITH (
	orientation=column,
	compression=middle
)
distribute by hash(product_id)
partition by range (created_at)
(
	partition p202401 values LESS THAN (''2024-02-01 00:00:00''),
	partition p202402 values LESS THAN (''2024-03-01 00:00:00''),
	partition p202403 values LESS THAN (''2024-04-01 00:00:00''),
	partition p202404 values LESS THAN (''2024-05-01 00:00:00'')
);

COMMENT ON COLUMN "poc_order"."order_id" IS ''订单ID'';
COMMENT ON COLUMN "poc_order"."user_id" IS ''用户ID'';
COMMENT ON COLUMN "poc_order"."product_id" IS ''商品ID'';
COMMENT ON COLUMN "poc_order"."total_price" IS ''订单总价'';
COMMENT ON COLUMN "poc_order"."status" IS ''订单状态（1：待支付，2：已支付，3：发货中，4：已完成，5：已取消）'';
COMMENT ON COLUMN "poc_order"."created_at" IS ''创建时间'';
COMMENT ON COLUMN "poc_order"."updated_at" IS ''更新时间'';
COMMENT ON COLUMN "poc_order"."payment_method" IS ''支付方式'';
COMMENT ON COLUMN "poc_order"."shipping_address" IS ''收货地址'';
COMMENT ON COLUMN "poc_order"."shipping_cost" IS ''运费'';
COMMENT ON COLUMN "poc_order"."discount" IS ''折扣金额'';
COMMENT ON COLUMN "poc_order"."coupon_code" IS ''使用的优惠券代码'';
COMMENT ON COLUMN "poc_order"."notes" IS ''订单备注'';
COMMENT ON COLUMN "poc_order"."tracking_number" IS ''物流跟踪号'';
COMMENT ON COLUMN "poc_order"."estimated_delivery_date" IS ''预计送达时间'';
COMMENT ON COLUMN "poc_order"."actual_delivery_date" IS ''实际送达时间'';
COMMENT ON COLUMN "poc_order"."cancel_reason" IS ''取消原因'';
COMMENT ON COLUMN "poc_order"."payment_date" IS ''支付时间'';
COMMENT ON COLUMN "poc_order"."shipment_date" IS ''发货时间'';
COMMENT ON COLUMN "poc_order"."completion_date" IS ''完成时间'';
COMMENT ON COLUMN "poc_order"."customer_service_contact" IS ''客服联系方式'';
COMMENT ON COLUMN "poc_order"."refund_amount" IS ''退款金额'';
COMMENT ON COLUMN "poc_order"."refund_reason" IS ''退款原因'';
COMMENT ON COLUMN "poc_order"."refund_date" IS ''退款时间'';
COMMENT ON COLUMN "poc_order"."review" IS ''订单评价{time: , content: }'';
COMMENT ON COLUMN "poc_order"."product_count" IS ''商品数量'';
COMMENT ON COLUMN "poc_order"."ip_address" IS ''下单时的IP地址'';
COMMENT ON COLUMN "poc_order"."send_ip" IS ''send_ip'';
COMMENT ON COLUMN "poc_order"."receive_ip" IS ''receive_ip'';
COMMENT ON COLUMN "poc_order"."send_port" IS ''send_port'';
COMMENT ON COLUMN "poc_order"."receive_port" IS ''receive_port'';
COMMENT ON COLUMN "poc_order"."send_time" IS ''send_time'';
COMMENT ON COLUMN "poc_order"."receive_time" IS ''receive_time'';
COMMENT ON TABLE "poc_order" IS ''订单表'';

DROP TABLE IF EXISTS "poc_product";

CREATE TABLE poc_product (
	"product_id" int8 NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NULL,
	"price" numeric(10, 2) NOT NULL,
	"category_id" int8 NOT NULL,
	"stock" int8 NOT NULL,
	"sold" int8 NULL,
	"rating" numeric(3, 2) NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"status" bool NOT NULL,
	"image_url" varchar(255) NULL,
	"shipping_cost" numeric(10, 2) NULL,
	"origin_country" varchar(50) NULL,
	"weight" numeric(5, 2) NULL,
	"dimensions" varchar(100) NULL,
	"color" varchar(30) NULL,
	"material" varchar(50) NULL,
	"brand_id" int8 NULL,
	"brand" varchar(50) NULL,
	"warranty_period" int4 NULL,
	"return_policy" varchar(255) NULL,
	"seller_id" int8 NULL,
	"discount" numeric(5, 2) NULL,
	"discount_start_date" timestamp(6) NULL,
	"discount_end_date" timestamp(6) NULL,
	"seo_title" varchar(255) NULL,
	"seo_description" varchar(255) NULL,
	"seo_keywords" varchar(255) NULL,
	"views" int4 NULL,
	"notes" text NULL
)
WITH (
	orientation=column,
	compression=middle
)
distribute by hash(product_id)
partition by range (created_at)
(
	partition p202401 values LESS THAN (''2024-02-01 00:00:00''),
	partition p202402 values LESS THAN (''2024-03-01 00:00:00''),
	partition p202403 values LESS THAN (''2024-04-01 00:00:00''),
	partition p202404 values LESS THAN (''2024-05-01 00:00:00'')
);

COMMENT ON COLUMN "poc_product"."product_id" IS ''商品ID'';
COMMENT ON COLUMN "poc_product"."name" IS ''商品名称'';
COMMENT ON COLUMN "poc_product"."description" IS ''商品描述'';
COMMENT ON COLUMN "poc_product"."price" IS ''价格'';
COMMENT ON COLUMN "poc_product"."category_id" IS ''分类ID'';
COMMENT ON COLUMN "poc_product"."stock" IS ''库存量'';
COMMENT ON COLUMN "poc_product"."sold" IS ''已售数量'';
COMMENT ON COLUMN "poc_product"."rating" IS ''评分'';
COMMENT ON COLUMN "poc_product"."created_at" IS ''创建时间'';
COMMENT ON COLUMN "poc_product"."updated_at" IS ''更新时间'';
COMMENT ON COLUMN "poc_product"."status" IS ''状态（1：上架，0：下架）'';
COMMENT ON COLUMN "poc_product"."image_url" IS ''商品图片URL'';
COMMENT ON COLUMN "poc_product"."shipping_cost" IS ''运费'';
COMMENT ON COLUMN "poc_product"."origin_country" IS ''产地国家'';
COMMENT ON COLUMN "poc_product"."weight" IS ''重量（kg）'';
COMMENT ON COLUMN "poc_product"."dimensions" IS ''尺寸（长x宽x高）'';
COMMENT ON COLUMN "poc_product"."color" IS ''颜色'';
COMMENT ON COLUMN "poc_product"."material" IS ''材质'';
COMMENT ON COLUMN "poc_product"."brand_id" IS ''品牌ID'';
COMMENT ON COLUMN "poc_product"."brand" IS ''品牌'';
COMMENT ON COLUMN "poc_product"."warranty_period" IS ''保修期（月）'';
COMMENT ON COLUMN "poc_product"."return_policy" IS ''退货政策'';
COMMENT ON COLUMN "poc_product"."seller_id" IS ''卖家ID'';
COMMENT ON COLUMN "poc_product"."discount" IS ''折扣'';
COMMENT ON COLUMN "poc_product"."discount_start_date" IS ''折扣开始时间'';
COMMENT ON COLUMN "poc_product"."discount_end_date" IS ''折扣结束时间'';
COMMENT ON COLUMN "poc_product"."seo_title" IS ''SEO标题'';
COMMENT ON COLUMN "poc_product"."seo_description" IS ''SEO描述'';
COMMENT ON COLUMN "poc_product"."seo_keywords" IS ''SEO关键词'';
COMMENT ON COLUMN "poc_product"."views" IS ''浏览量'';
COMMENT ON COLUMN "poc_product"."notes" IS ''备注'';
COMMENT ON TABLE "poc_product" IS ''商品表'';

-- poc_product_user_relation definition

-- Drop table

DROP TABLE IF EXISTS "poc_product_user_relation";

CREATE TABLE poc_product_user_relation (
	"relation_id" int8 NOT NULL,
	"product_id" int8 NOT NULL,
	"user_id" int8 NOT NULL,
	"created_at" timestamp(6) NOT NULL
)
WITH (
	orientation=column,
	compression=middle
)
distribute by hash(product_id)
partition by range (created_at)
(
	partition p202401 values LESS THAN (''2024-02-01 00:00:00''),
	partition p202402 values LESS THAN (''2024-03-01 00:00:00''),
	partition p202403 values LESS THAN (''2024-04-01 00:00:00''),
	partition p202404 values LESS THAN (''2024-05-01 00:00:00'')
);

COMMENT ON COLUMN "poc_product_user_relation"."relation_id" IS ''关系ID'';
COMMENT ON COLUMN "poc_product_user_relation"."product_id" IS ''商品ID'';
COMMENT ON COLUMN "poc_product_user_relation"."user_id" IS ''用户ID'';
COMMENT ON COLUMN "poc_product_user_relation"."created_at" IS ''创建时间'';
COMMENT ON TABLE "poc_product_user_relation" IS ''用户商品关系表'';

-- poc_sellers definition

-- Drop table

DROP TABLE IF EXISTS "poc_sellers";

CREATE TABLE poc_sellers (
	"seller_id" int8 NOT NULL,
	"seller_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20) NULL,
	"password" varchar(255) NOT NULL,
	"registration_date" timestamp DEFAULT now() NULL,
	"last_login_date" timestamp NULL,
	"address" varchar(255) NULL,
	"zip_code" varchar(10) NULL,
	"country" varchar(100) NULL,
	"business_type" varchar(100) NULL,
	"company_name" varchar(255) NULL,
	"status" varchar(50) DEFAULT ''active''::character varying NULL,
	"created_at" timestamp DEFAULT now() NULL
)
WITH (
	orientation=column,
	compression=middle
)
distribute by hash(seller_id)
partition by range (created_at)
(
	partition p202401 values LESS THAN (''2024-02-01 00:00:00''),
	partition p202402 values LESS THAN (''2024-03-01 00:00:00''),
	partition p202403 values LESS THAN (''2024-04-01 00:00:00''),
	partition p202404 values LESS THAN (''2024-05-01 00:00:00'')
);

COMMENT ON TABLE poc_sellers IS ''卖家信息表'';  
COMMENT ON COLUMN poc_sellers.seller_id IS ''卖家ID，作为主键'';  
COMMENT ON COLUMN poc_sellers.seller_name IS ''卖家名称或昵称'';  
COMMENT ON COLUMN poc_sellers.email IS ''卖家电子邮箱，确保唯一性'';  
COMMENT ON COLUMN poc_sellers.phone_number IS ''卖家电话号码'';  
COMMENT ON COLUMN poc_sellers.password IS ''卖家密码（注意：实际应用中应加密存储）'';  
COMMENT ON COLUMN poc_sellers.registration_date IS ''注册日期'';  
COMMENT ON COLUMN poc_sellers.last_login_date IS ''最近登录日期'';  
COMMENT ON COLUMN poc_sellers.address IS ''卖家地址'';  
COMMENT ON COLUMN poc_sellers.zip_code IS ''邮政编码'';  
COMMENT ON COLUMN poc_sellers.country IS ''国家'';  
COMMENT ON COLUMN poc_sellers.business_type IS ''业务类型（如个人、企业等）'';  
COMMENT ON COLUMN poc_sellers.company_name IS ''如果卖家是企业，则为公司名称'';  
COMMENT ON COLUMN poc_sellers.status IS ''卖家状态（如活跃、禁用等），默认为active'';

-- poc_user definition

-- Drop table

DROP TABLE IF EXISTS "poc_user";

CREATE TABLE poc_user (
	"user_id" int8 NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone_number" varchar(20) NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"last_login" timestamp(6) NULL,
	"last_login_ip" varchar(20) NOT NULL,
	"profile_picture" varchar(255) NULL,
	"birthday" date NULL,
	"gender" int4 NULL,
	"country" varchar(50) NULL,
	"state" varchar(50) NULL,
	"city" varchar(50) NULL,
	"address" varchar(255) NULL,
	"zip_code" varchar(10) NULL,
	"reward_points" int8 NULL,
	"account_balance" numeric(10, 2) NULL,
	"is_email_verified" int4 NULL,
	"is_phone_verified" int4 NULL,
	"security_question" varchar(255) NULL,
	"security_answer" varchar(255) NULL,
	"notes" text NULL,
	"preferences" text NULL,
	"login_attempts" int4 NULL,
	"lockout_time" timestamp(6) NULL
)
WITH (
	orientation=column,
	compression=middle
)
distribute by hash(user_id)
partition by range (created_at)
(
	partition p202401 values LESS THAN (''2024-02-01 00:00:00''),
	partition p202402 values LESS THAN (''2024-03-01 00:00:00''),
	partition p202403 values LESS THAN (''2024-04-01 00:00:00''),
	partition p202404 values LESS THAN (''2024-05-01 00:00:00'')
);

COMMENT ON TABLE poc_order IS "用户表";
COMMENT ON COLUMN "poc_user"."user_id" IS ''用户ID'';
COMMENT ON COLUMN "poc_user"."username" IS ''用户名'';
COMMENT ON COLUMN "poc_user"."password" IS ''密码'';
COMMENT ON COLUMN "poc_user"."email" IS ''电子邮箱'';
COMMENT ON COLUMN "poc_user"."phone_number" IS ''电话号码'';
COMMENT ON COLUMN "poc_user"."created_at" IS ''创建时间'';
COMMENT ON COLUMN "poc_user"."updated_at" IS ''更新时间'';
COMMENT ON COLUMN "poc_user"."last_login" IS ''最后登录时间'';
COMMENT ON COLUMN "poc_user"."last_login_ip" IS ''最后登录IP,检测IP段，异地登录'';
COMMENT ON COLUMN "poc_user"."profile_picture" IS ''头像URL'';
COMMENT ON COLUMN "poc_user"."birthday" IS ''生日'';
COMMENT ON COLUMN "poc_user"."gender" IS ''性别（1：男，2：女，0：未知）'';
COMMENT ON COLUMN "poc_user"."country" IS ''国家'';
COMMENT ON COLUMN "poc_user"."state" IS ''州/省'';
COMMENT ON COLUMN "poc_user"."city" IS ''城市'';
COMMENT ON COLUMN "poc_user"."address" IS ''地址'';
COMMENT ON COLUMN "poc_user"."zip_code" IS ''邮政编码'';
COMMENT ON COLUMN "poc_user"."reward_points" IS ''奖励积分'';
COMMENT ON COLUMN "poc_user"."account_balance" IS ''账户余额'';
COMMENT ON COLUMN "poc_user"."is_email_verified" IS ''邮箱是否验证（1：是，0：否）'';
COMMENT ON COLUMN "poc_user"."is_phone_verified" IS ''电话是否验证（1：是，0：否）'';
COMMENT ON COLUMN "poc_user"."security_question" IS ''安全问题'';
COMMENT ON COLUMN "poc_user"."security_answer" IS ''安全问题答案'';
COMMENT ON COLUMN "poc_user"."notes" IS ''备注'';
COMMENT ON COLUMN "poc_user"."preferences" IS ''偏好设置'';
COMMENT ON COLUMN "poc_user"."login_attempts" IS ''登录尝试次数'';
COMMENT ON COLUMN "poc_user"."lockout_time" IS ''账户锁定时间'';
COMMENT ON TABLE "poc_user" IS ''用户表'';');

