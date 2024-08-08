import random

import click
from flask.cli import with_appcontext

from app import db
from app.models.product import Product


@click.command("generate-products")
@click.option('--count', default=500, help='Number of products to generate')
@with_appcontext
def generate_products(count):
    """Generate sample products."""
    for i in range(1, count + 1):
        product = Product(
            name=f'Product {i}',
            description=f'This is a description for Product {i}',
            price=round(random.uniform(10.0, 1000.0), 2),
            stock=random.randint(0, 100)
        )
        db.session.add(product)

    db.session.commit()
    click.echo(f'{count} products generated successfully.')
