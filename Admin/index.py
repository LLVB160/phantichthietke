from flask import Flask, render_template, url_for, jsonify, request, redirect
from flask_bcrypt import Bcrypt

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

from flask_login import LoginManager, login_required, UserMixin
from flask_login import login_user, logout_user, current_user

import calendar
from datetime import datetime

import pandas as pd
from flask import send_file
import io
from io import BytesIO
#pip install XlsxWriter
import sys
sys.stdout.reconfigure(encoding='utf-8')


# /login



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost/pttkhtttdb2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'abcxyz123'

db = SQLAlchemy(app)

login = LoginManager(app=app)
login.login_view = 'user_login'


with app.app_context():
    Base = automap_base()
    # Base.prepare(db.engine, reflect=True)
    Base.prepare(autoload_with=db.engine)
    db_session = Session(db.engine)
    Users = Base.classes.users
    Products = Base.classes.products
    Categories = Base.classes.categories
    Suppliers = Base.classes.suppliers
    Orders = Base.classes.orders
    OrderDetails = Base.classes.order_details
    Goods_Receipt = Base.classes.import_receipts
    Goods_Receipt_Details = Base.classes.import_receipt_details



class User(UserMixin):
    def __init__(self, user_obj):
        self.user_id = user_obj.user_id
        self.email = user_obj.email
        self.password = user_obj.password
        self.full_name = user_obj.full_name
        self.address = user_obj.address
        self.phone = user_obj.phone
        self.role = user_obj.role


    def get_id(self):
        return str(self.user_id)

@login.user_loader
def user_loader(user_id):
    user_obj = db.session.query(Users).get(user_id)
    if user_obj:
        return User(user_obj)
    return None

@app.route('/login', methods=['GET', 'POST'])
def user_login():
    message = ''
    user = None  

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        # hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

        if username and password:
            user_obj = db.session.query(Users).filter_by(username=username, password=password).first()
            if user_obj and user_obj.role in ['admin', 'employee', 'warehouse_manager']:
                user = User(user_obj)
                login_user(user)
                return redirect('/admin')
            else:
                message = 'Tài khoản hoặc Mật Khẩu không chính xác'

    return render_template('login.html', message=message)

@app.route('/logout')
def user_logout():
    logout_user()
    return redirect('/login')


@app.route('/admin')
@login_required
def admin():
    return render_template('admin.html')

@app.route('/user', methods=['GET'])
def AdminUserManager():
    users = db.session.query(Users).all()
    message = request.args.get('message')
    return render_template('user.html', users = users, message=message)

@app.route('/user/new-user', methods=['GET', 'POST'])
@login_required
def newUser():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        full_name = request.form.get('fullname', '').strip()
        address = request.form.get('address', '').strip()
        phone = request.form.get('phone', '').strip()
        role = request.form.get('role', '').strip()
        email= request.form.get('email', '').strip()

        checkUsername = db.session.query(Users).filter_by(username=username).first()
        if checkUsername:
            return redirect(url_for('AdminUserManager', message='Lỗi: Username đã tồn tại!'))
        
        checkPhone = db.session.query(Users).filter_by(phone=phone).first()
        if checkPhone:
            return redirect(url_for('AdminUserManager', message='Lỗi: Số điện thoại đã tồn tại!'))
        
        checkEmail = db.session.query(Users).filter_by(email=email).first()
        if checkEmail:
            return redirect(url_for('AdminUserManager', message='Lỗi: Email đã tồn tại!'))

        try:
            new_user = Users(
                username=username,
                password=password,
                full_name=full_name,
                address=address,
                phone=phone,
                role=role,
                email=email
            )
            db.session.add(new_user)
            db.session.commit()
        
            return redirect(url_for('AdminUserManager', message='Thêm người dùng thành công!'))
        except Exception as e:
            db.session.rollback() 
            return redirect(url_for('AdminUserManager', message='Lỗi!'))
        

    return render_template('new-user.html')


@app.route('/user/update-user/<int:user_id>', methods=['GET', 'POST'])
@login_required
def update_user(user_id):
    user = db.session.query(Users).get(user_id)
    
    if request.method == 'POST':
        full_name = request.form.get('fullname', '').strip()
        address = request.form.get('address', '').strip()
        phone = request.form.get('phone', '').strip()
        role = request.form.get('role', '').strip()
        email= request.form.get('email', '').strip()

        if full_name != user.full_name:
            user.full_name = full_name
        if address != user.address:
            user.address = address
        if phone != user.phone:
            user.phone = phone  
        if role != user.role:
            user.role = role
        if email != user.email:
            user.email = email
        
        try:
            db.session.commit()
            return redirect(url_for('AdminUserManager', message="Cập nhật thành công!"))
        except Exception as e:
            db.session.rollback()
            return redirect(url_for('AdminUserManager', message="Có lỗi xảy ra khi cập nhật!"))

    return render_template('update-user.html', user=user)



@app.route('/user/delete-user/<int:user_id>', methods=['GET'])
@login_required
def delete_user(user_id):
    
    print(f"Đang xoá user có ID: {user_id}")
    user = db.session.query(Users).get(user_id)
    if not user:
        return redirect(url_for('AdminUserManager', message="User không tồn tại"))

    try:
        db.session.delete(user)
        db.session.commit()
        return redirect(url_for('AdminUserManager', message="Xóa thành công!"))
    except Exception as e:
        db.session.rollback()
        return redirect(url_for('AdminUserManager', message="Lỗi khi xóa!"))

#______________________________________________________________________ products

@app.route('/product', methods=['GET'])
@login_required
def productManager():
    sort_key = request.args.get('sort', '')
    search = request.args.get('search', '')
    message = request.args.get('message')

    query = db.session.query(Products)

    # Lọc theo tên sản phẩm hoặc tên nhà cung cấp
    if search:
        query = query.filter(
            (Products.name.ilike(f"%{search}%")) | 
            (Suppliers.name.ilike(f"%{search}%"))
        )

    if sort_key == 'name':
        query = query.order_by(Products.name.asc())
    elif sort_key == 'supplier':
        query = query.order_by(Products.supplier.asc())
    else:
        query = query.order_by(Products.product_id.asc())  

    products = query.all() 

    return render_template('product.html', products=products, message=message)





@app.route('/product/new-product', methods=['GET', 'POST'])
@login_required
def newProduct():

    categories = db.session.query(Categories.category_id, Categories.name).all()
    suppliers = db.session.query(Suppliers.supplier_id, Suppliers.name).all()

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        description = request.form.get('description', '').strip()
        price = request.form.get('price', '').strip()
        quantity = request.form.get('quantity', '').strip()
        img_url = request.form.get('img_url', '').strip()
        category = request.form.get('category', '').strip()
        supplier= request.form.get('supplier', '').strip()

        supplier_name = db.session.query(Suppliers).get(int(supplier))

        try:
            new_product = Products(
                name=name,
                description=description,
                price=float(price),
                quantity=int(quantity),
                img_url=img_url,
                category_id=int(category),
                supplier_id=int(supplier),
                supplier=supplier_name.name
            )
            db.session.add(new_product)
            db.session.commit()
        
            return redirect(url_for('productManager', message='Thêm sản phẩm thành công!'))
        except Exception as e:
            db.session.rollback() 
            # return f"Lỗi: {str(e)}"
            return redirect(url_for('productManager', message='Lỗi!'))
        

    return render_template('new-product.html', categories=categories, suppliers=suppliers)


@app.route('/product/update-product/<int:product_id>', methods=['GET', 'POST'])
@login_required
def update_product(product_id):
    product = db.session.query(Products).get(product_id)
    
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        description = request.form.get('description', '').strip()
        price = request.form.get('price', '').strip()
        quantity = request.form.get('quantity', '').strip()
        img_url = request.form.get('img_url', '').strip()
        category = request.form.get('category', '').strip()
        supplier= request.form.get('supplier', '').strip()


        if name != product.name:
            product.name = name
        if description != product.description:
            product.description = description
        if price != product.price:
            product.price = float(price)
        if quantity != product.quantity:
            product.quantity = int(quantity)
        if img_url != product.img_url:
            product.img_url = img_url
        if category != product.category_id:
            product.category_id = int(category)
        if supplier != product.supplier_id:
            product.supplier_id = int(supplier)

        try:
            db.session.commit()
            return redirect(url_for('productManager', message="Cập nhật thành công!"))
        except Exception as e:
            db.session.rollback()
            return redirect(url_for('productManager', message="Có lỗi xảy ra khi cập nhật!"))

    return render_template('update-product.html', product=product)


@app.route('/product/delete-product/<int:product_id>', methods=['GET'])
@login_required
def delete_product(product_id):
    product = db.session.query(Products).get(product_id)
    if not product:
        return redirect(url_for('productManager', message="Sản phẩm không tồn tại"))

    try:
        db.session.delete(product)
        db.session.commit()
        return redirect(url_for('productManager', message="Xóa sản phẩm thành công!"))
    except Exception as e:
        db.session.rollback()
        return redirect(url_for('productManager', message="Lỗi khi xóa sản phẩm!"))
    


#_______________________________________________________________________ end products

#_______________________________________________________________________ SUPPLIERS

@app.route('/supplier', methods=['GET'])
@login_required
def supplierManager():

    suppliers = db.session.query(Suppliers).all()
    message = request.args.get('message')
    return render_template('supplier.html', suppliers = suppliers, message=message)


@app.route('/supplier/new-supplier', methods=['GET', 'POST'])
@login_required
def newSupplier():
    if request.method == 'POST':

        name = request.form.get('name', '').strip()
        address = request.form.get('address', '').strip()
        phone = request.form.get('phone', '').strip()
        email= request.form.get('email', '').strip()

        try:
            new_supplier = Suppliers(
                name=name,
                address=address,
                phone=phone,
                email=email
            )
            db.session.add(new_supplier)
            db.session.commit()
        
            return redirect(url_for('supplierManager', message='Thêm nhà cung cấp thành công!'))
        except Exception as e:
            db.session.rollback() 
            return redirect(url_for('supplierManager', message='Lỗi!'))
        

    return render_template('new-supplier.html')

@app.route('/supplier/update-supplier/<int:supplier_id>', methods=['GET', 'POST'])
@login_required
def update_supplier(supplier_id):
    supplier = db.session.query(Suppliers).get(supplier_id)
    
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        address = request.form.get('address', '').strip()
        phone = request.form.get('phone', '').strip()
        email= request.form.get('email', '').strip()

        if name != supplier.name:
            supplier.name = name
        if address != supplier.address:
            supplier.address = address
        if phone  != supplier.phone:
            supplier.phone = phone  
        if email != supplier.email:
            supplier.email = email
        
        try:
            db.session.commit()
            return redirect(url_for('supplierManager', message="Cập nhật thành công!"))
        except Exception as e:
            db.session.rollback()
            return redirect(url_for('supplierManager', message="Có lỗi xảy ra khi cập nhật!"))

    return render_template('update-supplier.html', supplier=supplier)



@app.route('/supplier/delete-supplier/<int:supplier_id>', methods=['GET'])
@login_required
def delete_supplier(supplier_id):

    supplier = db.session.query(Suppliers).get(supplier_id)
    if not supplier:
        return redirect(url_for('supplierManager', message="Supplier không tồn tại"))

    try:
        db.session.delete(supplier)
        db.session.commit()
        return redirect(url_for('supplierManager', message="Xóa thành công!"))
    except Exception as e:
        db.session.rollback()
        return redirect(url_for('supplierManager', message="Lỗi khi xóa!"))

#_______________________________________________________________________ END SUPPLIERS

#_______________________________________________________________________ ORDERS

from datetime import datetime

@app.route('/orders', methods=['GET', 'POST'])
@login_required
def orderManager():
    query = db.session.query(Orders, Users).join(Users, Orders.user_id == Users.user_id)

    if request.method == 'POST':
        start_date_str = request.form.get('start_date')
        end_date_str = request.form.get('end_date')

        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
                end_date = end_date.replace(hour=23, minute=59, second=59)

                query = query.filter(Orders.order_date.between(start_date, end_date))
            except ValueError:
                pass  

    orders = query.order_by(Orders.order_id.asc()).all()

    return render_template('order.html', orders=orders)


@app.route('/update-order-status/<int:order_id>', methods=['POST'])
@login_required
def update_order_status(order_id):
    data = request.get_json()
    new_status = data.get('status')

    try:
        order = db.session.query(Orders).get(order_id)
        if order:
            order.status = new_status
            db.session.commit()
            return jsonify({"message": "Cập nhật trạng thái thành công!"})
        else:
            return jsonify({"message": "Không tìm thấy đơn hàng."}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Có lỗi xảy ra khi cập nhật!"}), 500


from sqlalchemy import func
    
from sqlalchemy import extract


# @app.route('/order/stats', methods=['GET', 'POST'])
# @login_required
# def order_stats():
#     selected_from_month = None
#     selected_to_month = None
#     start_date = None
#     end_date = None

#     if request.method == 'POST':
#         selected_from_month = request.form.get('from_month') 
#         selected_to_month = request.form.get('to_month')     

#         if selected_from_month and selected_to_month:
#             from_year, from_month = map(int, selected_from_month.split('-'))
#             to_year, to_month = map(int, selected_to_month.split('-'))

#             start_date = datetime(from_year, from_month, 1)

#             last_day = calendar.monthrange(to_year, to_month)[1]
#             end_date = datetime(to_year, to_month, last_day)

#     query = db.session.query(
#         Products.product_id,
#         Products.name,
#         func.sum(OrderDetails.quantity).label('quantity'),
#         func.sum(OrderDetails.quantity * OrderDetails.price).label('total')
#     )\
#     .join(OrderDetails, Products.product_id == OrderDetails.product_id)\
#     .join(Orders, Orders.order_id == OrderDetails.order_id)

#     if start_date and end_date:
#         query = query.filter(Orders.order_date >= start_date,
#                              Orders.order_date <= end_date)

#     product_revenue = query.group_by(Products.product_id, Products.name).all()

#     total_query = db.session.query(
#         func.sum(OrderDetails.quantity * OrderDetails.price)
#     ).join(Orders, Orders.order_id == OrderDetails.order_id)

#     if start_date and end_date:
#         total_query = total_query.filter(Orders.order_date >= start_date,
#                                          Orders.order_date <= end_date)

#     total_revenue = total_query.scalar() or 0

#     return render_template(
#         'order-stats.html',
#         product_revenue=product_revenue,
#         total_revenue=total_revenue,
#         selected_from_month=selected_from_month,
#         selected_to_month=selected_to_month
#     )

@app.route('/order/stats', methods=['GET', 'POST'])
@login_required
def order_stats():
    selected_from_month = None
    selected_to_month = None
    start_date = None
    end_date = None

    if request.method == 'POST':
        selected_from_month = request.form.get('from_month') 
        selected_to_month = request.form.get('to_month')     

        if selected_from_month and selected_to_month:
            from_year, from_month = map(int, selected_from_month.split('-'))
            to_year, to_month = map(int, selected_to_month.split('-'))

            start_date = datetime(from_year, from_month, 1)
            last_day = calendar.monthrange(to_year, to_month)[1]
            end_date = datetime(to_year, to_month, last_day)

    query = db.session.query(
        OrderDetails.product_id,
        OrderDetails.product_name,
        func.sum(OrderDetails.quantity).label('quantity'),
        func.sum(OrderDetails.quantity * OrderDetails.price).label('total')
    ).join(Orders, Orders.order_id == OrderDetails.order_id)

    if start_date and end_date:
        query = query.filter(Orders.order_date >= start_date,
                             Orders.order_date <= end_date)

    product_revenue = query.group_by(OrderDetails.product_id, OrderDetails.product_name).all()

    total_query = db.session.query(
        func.sum(OrderDetails.quantity * OrderDetails.price)
    ).join(Orders, Orders.order_id == OrderDetails.order_id)

    if start_date and end_date:
        total_query = total_query.filter(Orders.order_date >= start_date,
                                         Orders.order_date <= end_date)

    total_revenue = total_query.scalar() or 0

    return render_template(
        'order-stats.html',
        product_revenue=product_revenue,
        total_revenue=total_revenue,
        selected_from_month=selected_from_month,
        selected_to_month=selected_to_month
    )



# @app.route('/order/stats/export', methods=['POST'])
# @login_required
# def export_order_stats_excel():
#     from_month = request.form.get('from_month')
#     to_month = request.form.get('to_month')

#     if not from_month or not to_month:
#         return redirect(url_for('order_stats'))

#     from_year, from_m = map(int, from_month.split('-'))
#     to_year, to_m = map(int, to_month.split('-'))

#     start_date = datetime(from_year, from_m, 1)
#     end_date = datetime(to_year, to_m, calendar.monthrange(to_year, to_m)[1])

#     # Truy vấn dữ liệu thống kê
#     query = db.session.query(
#         Products.product_id.label('Product ID'),
#         Products.name.label('Product Name'),
#         func.sum(OrderDetails.quantity).label('Quantity'),
#         func.sum(OrderDetails.quantity * OrderDetails.price).label('Total Price')
#     )\
#     .join(OrderDetails, Products.product_id == OrderDetails.product_id)\
#     .join(Orders, Orders.order_id == OrderDetails.order_id)\
#     .filter(Orders.order_date >= start_date, Orders.order_date <= end_date)\
#     .group_by(Products.product_id, Products.name).all()

#     df = pd.DataFrame(query, columns=['Product ID', 'Product Name', 'Quantity', 'Total Price'])

#     output = BytesIO()
#     with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
#         df.to_excel(writer, sheet_name='Order Stats', index=False)
#     output.seek(0)

#     filename = f'stats_order_{from_month}_to_{to_month}.xlsx'
#     return send_file(output,
#                      download_name=filename,
#                      as_attachment=True,
#                      mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
@app.route('/order/stats/export', methods=['POST'])
@login_required
def export_order_stats_excel():
    from_month = request.form.get('from_month')
    to_month = request.form.get('to_month')

    if not from_month or not to_month:
        return redirect(url_for('order_stats'))

    from_year, from_m = map(int, from_month.split('-'))
    to_year, to_m = map(int, to_month.split('-'))

    start_date = datetime(from_year, from_m, 1)
    end_date = datetime(to_year, to_m, calendar.monthrange(to_year, to_m)[1])

    query = db.session.query(
        OrderDetails.product_id.label('Product ID'),
        OrderDetails.product_name.label('Product Name'),
        func.sum(OrderDetails.quantity).label('Quantity'),
        func.sum(OrderDetails.quantity * OrderDetails.price).label('Total Price')
    ).join(Orders, Orders.order_id == OrderDetails.order_id)\
     .filter(Orders.order_date >= start_date, Orders.order_date <= end_date)\
     .group_by(OrderDetails.product_id, OrderDetails.product_name).all()

    df = pd.DataFrame(query, columns=['Product ID', 'Product Name', 'Quantity', 'Total Price'])

    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, sheet_name='Order Stats', index=False)
    output.seek(0)

    filename = f'stats_order_{from_month}_to_{to_month}.xlsx'
    return send_file(output,
                     download_name=filename,
                     as_attachment=True,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')


@app.route('/order-detail/<int:order_id>', methods=['GET', 'POST'])
@login_required
def orderDetailByID(order_id):
    details = db.session.query(OrderDetails).filter(OrderDetails.order_id == order_id).all()

    return render_template('order-detail.html', details=details)


#__________________________________________________________________________________ end order

@app.route('/goods-receipt', methods=['GET', 'POST'])
@login_required
def receiptManager():
    message = request.args.get('message') 
    query = db.session.query(
    Goods_Receipt,
    func.coalesce(func.sum(Goods_Receipt_Details.price * Goods_Receipt_Details.quantity), 0).label('total_amount')
    ).outerjoin(Goods_Receipt_Details, Goods_Receipt.receipt_id == Goods_Receipt_Details.receipt_id)\
    .group_by(Goods_Receipt.receipt_id)

    receipts = query.order_by(Goods_Receipt.receipt_id.asc()).all()

    return render_template('receipt.html', receipts=receipts, message=message)


@app.route('/goods-receipt/new-goods-receipt', methods=['GET', 'POST'])
@login_required
def newReceipt():

    suppliers = db.session.query(Suppliers.supplier_id, Suppliers.name).all()

    if request.method == 'POST':
        supplier= request.form.get('supplier', '').strip()

        supplier_name = db.session.query(Suppliers).get(int(supplier))

        try:
            new_receipt = Goods_Receipt(
                supplier_id=int(supplier),
                supplier=supplier_name.name
            )
            db.session.add(new_receipt)
            db.session.commit()
        
            return redirect(url_for('receiptManager', message='Thêm hóa đơn thành công!'))
        except Exception as e:
            db.session.rollback() 
            return redirect(url_for('receiptManager', message='Lỗi!'))
        
    return render_template('new-receipt.html', suppliers=suppliers)

@app.route('/goods-receipt/new-goods-receipt-detail', methods=['GET', 'POST'])
@login_required
def newReceiptDetail():


    products = db.session.query(Products.name, Products.product_id).all()
    receipts = db.session.query(Goods_Receipt).all()

    if request.method == 'POST':
        product = request.form.get('product')
        receipt= request.form.get('receipt', '').strip()
        quantity = request.form.get('quantity', '').strip()
        price = request.form.get('price', '').strip()

        product_name = db.session.query(Products).get(int(product))


        try:
            new_receipt_detail = Goods_Receipt_Details(
                product_id=int(product),
                receipt_id=int(receipt),
                quantity=int(quantity),
                price=float(price),
                product_name=product_name.name
            )
            db.session.add(new_receipt_detail)
            db.session.commit()

            updateQuantityProduct(product, int(quantity))

        
            return redirect(url_for('receiptManager', message='Thêm chi tiết đơn nhập hàng thành công!'))
        except Exception as e:
            db.session.rollback() 
            print(e)
            return redirect(url_for('receiptManager', message='Lỗi!'))
        

    return render_template('new-receipt-detail.html', products = products, receipts=receipts)

@app.route('/api/products-by-receipt/<int:receipt_id>')
@login_required
def getProductsByReceipt(receipt_id):
    receipt = db.session.query(Goods_Receipt).get(receipt_id)
    if not receipt:
        return jsonify([])

    supplier_id = receipt.supplier_id
    products = db.session.query(Products).filter_by(supplier_id=supplier_id).all()
    
    product_list = [{"product_id": p.product_id, "name": p.name} for p in products]
    return jsonify(product_list)


def updateQuantityProduct( product_id, quantity):    
    product = db.session.query(Products).get(product_id)
    if product:
        product.quantity += quantity
        db.session.commit()


@app.route('/goods-receipt-detail/<int:receipt_id>', methods=['GET', 'POST'])
@login_required

def receiptDetailByID(receipt_id):
    details = db.session.query(Goods_Receipt_Details).filter(Goods_Receipt_Details.receipt_id == receipt_id).all()

    return render_template('receipt-detail.html', details=details)



# @app.route('/goods-receipt/stats', methods=['GET', 'POST'])
# @login_required
# def goods_receipt_stats():
#     selected_from_month = None
#     selected_to_month = None
#     start_date = None
#     end_date = None

#     if request.method == 'POST':
#         selected_from_month = request.form.get('from_month') 
#         selected_to_month = request.form.get('to_month')      

#         if selected_from_month and selected_to_month:

#             from_year, from_month = map(int, selected_from_month.split('-'))
#             to_year, to_month = map(int, selected_to_month.split('-'))

#             start_date = datetime(from_year, from_month, 1)

#             last_day = calendar.monthrange(to_year, to_month)[1]
#             end_date = datetime(to_year, to_month, last_day)

#     query = db.session.query(
#         Products.product_id,
#         Products.name.label('product_name'),
#         Suppliers.name.label('supplier_name'),
#         func.sum(Goods_Receipt_Details.quantity).label('total_quantity'),
#         func.sum(Goods_Receipt_Details.quantity * Goods_Receipt_Details.price).label('total_price')
#     )\
#     .join(Goods_Receipt_Details, Products.product_id == Goods_Receipt_Details.product_id)\
#     .join(Goods_Receipt, Goods_Receipt.receipt_id == Goods_Receipt_Details.receipt_id)\
#     .join(Suppliers, Suppliers.supplier_id == Products.supplier_id)

#     if start_date and end_date:
#         query = query.filter(Goods_Receipt.import_date >= start_date,
#                              Goods_Receipt.import_date <= end_date)

#     product_import_stats = query.group_by(Products.product_id, Products.name, Suppliers.name).all()

#     total_query = db.session.query(
#         func.sum(Goods_Receipt_Details.quantity * Goods_Receipt_Details.price)
#     ).join(Goods_Receipt, Goods_Receipt.receipt_id == Goods_Receipt_Details.receipt_id)

#     if start_date and end_date:
#         total_query = total_query.filter(Goods_Receipt.import_date >= start_date,
#                                          Goods_Receipt.import_date <= end_date)

#     total_import_cost = total_query.scalar() or 0

#     return render_template(
#         'receipt-stats.html',
#         product_import_stats=product_import_stats,
#         total_import_cost=total_import_cost,
#         selected_from_month=selected_from_month,
#         selected_to_month=selected_to_month
#     )

@app.route('/goods-receipt/stats', methods=['GET', 'POST'])
@login_required
def goods_receipt_stats():
    selected_from_month = None
    selected_to_month = None
    start_date = None
    end_date = None

    if request.method == 'POST':
        selected_from_month = request.form.get('from_month') 
        selected_to_month = request.form.get('to_month')      

        if selected_from_month and selected_to_month:
            from_year, from_month = map(int, selected_from_month.split('-'))
            to_year, to_month = map(int, selected_to_month.split('-'))

            start_date = datetime(from_year, from_month, 1)
            last_day = calendar.monthrange(to_year, to_month)[1]
            end_date = datetime(to_year, to_month, last_day)

    query = db.session.query(
        Goods_Receipt_Details.product_id,
        Goods_Receipt_Details.product_name,
        Goods_Receipt.supplier.label('supplier_name'), 
        func.sum(Goods_Receipt_Details.quantity).label('total_quantity'),
        func.sum(Goods_Receipt_Details.quantity * Goods_Receipt_Details.price).label('total_price')
    )\
    .join(Goods_Receipt, Goods_Receipt.receipt_id == Goods_Receipt_Details.receipt_id)

    if start_date and end_date:
        query = query.filter(
            Goods_Receipt.import_date >= start_date,
            Goods_Receipt.import_date <= end_date
        )

    product_import_stats = query.group_by(
        Goods_Receipt_Details.product_id,
        Goods_Receipt_Details.product_name,
        Goods_Receipt.supplier
    ).all()

    total_query = db.session.query(
        func.sum(Goods_Receipt_Details.quantity * Goods_Receipt_Details.price)
    ).join(Goods_Receipt, Goods_Receipt.receipt_id == Goods_Receipt_Details.receipt_id)

    if start_date and end_date:
        total_query = total_query.filter(
            Goods_Receipt.import_date >= start_date,
            Goods_Receipt.import_date <= end_date
        )

    total_import_cost = total_query.scalar() or 0

    return render_template(
        'receipt-stats.html',
        product_import_stats=product_import_stats,
        total_import_cost=total_import_cost,
        selected_from_month=selected_from_month,
        selected_to_month=selected_to_month
    )



# @app.route('/goods-receipt/export', methods=['POST'])
# @login_required
# def export_goods_receipt_excel():
#     from_month = request.form.get('from_month')
#     to_month = request.form.get('to_month')

#     if not from_month or not to_month:
#         return redirect(url_for('goods_receipt_stats'))

#     from_year, from_m = map(int, from_month.split('-'))
#     to_year, to_m = map(int, to_month.split('-'))

#     start_date = datetime(from_year, from_m, 1)
#     end_date = datetime(to_year, to_m, calendar.monthrange(to_year, to_m)[1])

#     # Truy vấn dữ liệu như ở hàm thống kê
#     query = db.session.query(
#         Products.name.label('Product Name'),
#         Suppliers.name.label('Supplier Name'),
#         func.sum(Goods_Receipt_Details.quantity).label('Quantity'),
#         func.sum(Goods_Receipt_Details.quantity * Goods_Receipt_Details.price).label('Total Price')
#     )\
#     .join(Goods_Receipt_Details, Products.product_id == Goods_Receipt_Details.product_id)\
#     .join(Goods_Receipt, Goods_Receipt.receipt_id == Goods_Receipt_Details.receipt_id)\
#     .join(Suppliers, Suppliers.supplier_id == Products.supplier_id)\
#     .filter(Goods_Receipt.import_date >= start_date, Goods_Receipt.import_date <= end_date)\
#     .group_by(Products.name, Suppliers.name).all()

#     df = pd.DataFrame(query, columns=['Product Name', 'Supplier Name', 'Quantity', 'Total Price'])

#     output = BytesIO()
#     with pd.ExcelWriter(output, engine='openpyxl') as writer:
#         df.to_excel(writer, index=False, sheet_name='Thống kê nhập hàng')
#     output.seek(0)

#     filename = f'stats_{from_month}_to_{to_month}.xlsx'
#     return send_file(output, download_name=filename, as_attachment=True)

@app.route('/goods-receipt/export', methods=['POST'])
@login_required
def export_goods_receipt_excel():
    from_month = request.form.get('from_month')
    to_month = request.form.get('to_month')

    if not from_month or not to_month:
        return redirect(url_for('goods_receipt_stats'))

    from_year, from_m = map(int, from_month.split('-'))
    to_year, to_m = map(int, to_month.split('-'))

    start_date = datetime(from_year, from_m, 1)
    end_date = datetime(to_year, to_m, calendar.monthrange(to_year, to_m)[1])

    # Truy vấn chỉ từ 2 bảng
    query = db.session.query(
        Goods_Receipt_Details.product_name.label('Product Name'),
        Goods_Receipt.supplier.label('Supplier Name'),
        func.sum(Goods_Receipt_Details.quantity).label('Quantity'),
        func.sum(Goods_Receipt_Details.quantity * Goods_Receipt_Details.price).label('Total Price')
    )\
    .join(Goods_Receipt, Goods_Receipt.receipt_id == Goods_Receipt_Details.receipt_id)\
    .filter(Goods_Receipt.import_date >= start_date, Goods_Receipt.import_date <= end_date)\
    .group_by(Goods_Receipt_Details.product_name, Goods_Receipt.supplier)\
    .all()

    df = pd.DataFrame(query, columns=['Product Name', 'Supplier Name', 'Quantity', 'Total Price'])

    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Thống kê nhập hàng')
    output.seek(0)

    filename = f'stats_{from_month}_to_{to_month}.xlsx'
    return send_file(output, download_name=filename, as_attachment=True)



if __name__ == '__main__':
    app.run(debug=True)
