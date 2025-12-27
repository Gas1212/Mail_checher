#!/bin/bash
# Fix JWT package on serv00

echo "Fixing JWT package installation..."

# Uninstall both jwt packages
pip uninstall -y jwt PyJWT

# Reinstall only PyJWT
pip install PyJWT==2.8.0

echo "Testing JWT import..."
python -c "import jwt; print('JWT version:', jwt.__version__); print('Has encode:', hasattr(jwt, 'encode'))"

echo "Done!"
