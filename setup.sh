#!/bin/bash
# 论坛一键安装脚本
# 在Ubuntu虚拟机中运行此脚本

set -e

echo "======================================"
echo "  生活圈论坛 - 一键安装脚本"
echo "======================================"

# 1. 更新系统
echo "[1/5] 更新系统软件包..."
sudo apt update -y

# 2. 安装 Node.js 22
echo "[2/5] 安装 Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 3. 解压论坛文件（假设已上传到当前目录）
echo "[3/5] 安装论坛依赖..."
cd ~/forum
npm install

# 4. 创建systemd服务（开机自动启动）
echo "[4/5] 配置开机自启..."
sudo bash -c "cat > /etc/systemd/system/forum.service << EOF
[Unit]
Description=生活圈论坛
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/forum
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target
EOF"

sudo systemctl daemon-reload
sudo systemctl enable forum
sudo systemctl start forum

# 5. 配置防火墙（开放3000端口）
echo "[5/5] 配置防火墙..."
sudo ufw allow 3000/tcp 2>/dev/null || true

# 完成
IP=$(hostname -I | awk '{print $1}')
echo ""
echo "======================================"
echo "  ✅ 安装完成！"
echo "======================================"
echo ""
echo "  🌐 本地访问: http://localhost:3000"
echo "  🌐 局域网访问: http://${IP}:3000"
echo ""
echo "  👤 管理员账号: admin"
echo "  🔑 初始密码:   admin123"
echo "  ⚠️  请登录后台修改管理员密码！"
echo ""
echo "  常用命令："
echo "  sudo systemctl status forum   # 查看状态"
echo "  sudo systemctl restart forum  # 重启论坛"
echo "  sudo journalctl -u forum -f   # 查看日志"
echo "======================================"
