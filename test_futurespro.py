from playwright.sync_api import sync_playwright
import requests
import json
import time

# 测试后端API接口
def test_backend_api():
    print("=== 测试后端API接口 ===")
    
    # 测试健康检查
    print("1. 测试健康检查接口...")
    response = requests.get("http://localhost:8000/api/v1/health")
    print(f"   状态码: {response.status_code}")
    print(f"   响应: {response.json()}")
    
    # 测试获取策略列表
    print("\n2. 测试获取策略列表接口...")
    response = requests.get("http://localhost:8000/api/v1/strategies")
    print(f"   状态码: {response.status_code}")
    print(f"   策略数量: {len(response.json())}")
    
    # 测试获取单个策略
    print("\n3. 测试获取单个策略接口...")
    response = requests.get("http://localhost:8000/api/v1/strategies/1")
    print(f"   状态码: {response.status_code}")
    print(f"   策略名称: {response.json()['name']}")
    
    # 测试创建策略
    print("\n4. 测试创建策略接口...")
    new_strategy = {
        "name": "测试策略",
        "type": "trend_following",
        "parameters": {
            "period": 20,
            "threshold": 0.02
        }
    }
    response = requests.post("http://localhost:8000/api/v1/strategies", json=new_strategy)
    print(f"   状态码: {response.status_code}")
    print(f"   创建的策略ID: {response.json()['id']}")
    
    # 测试启动策略
    print("\n5. 测试启动策略接口...")
    response = requests.post("http://localhost:8000/api/v1/strategies/1/start")
    print(f"   状态码: {response.status_code}")
    print(f"   策略状态: {response.json()['status']}")
    
    # 测试停止策略
    print("\n6. 测试停止策略接口...")
    response = requests.post("http://localhost:8000/api/v1/strategies/1/stop")
    print(f"   状态码: {response.status_code}")
    print(f"   策略状态: {response.json()['status']}")
    
    # 测试获取AI建议
    print("\n7. 测试获取AI建议接口...")
    response = requests.get("http://localhost:8000/api/v1/strategies/1/ai-suggestions")
    print(f"   状态码: {response.status_code}")
    print(f"   建议数量: {len(response.json()['suggestions'])}")
    
    # 测试获取订单列表
    print("\n8. 测试获取订单列表接口...")
    response = requests.get("http://localhost:8000/api/v1/trading/orders")
    print(f"   状态码: {response.status_code}")
    print(f"   订单数量: {len(response.json())}")
    
    # 测试创建订单
    print("\n9. 测试创建订单接口...")
    new_order = {
        "symbol": "螺纹钢2510",
        "direction": "BUY",
        "volume": 2,
        "price": 3850.00
    }
    response = requests.post("http://localhost:8000/api/v1/trading/orders", json=new_order)
    print(f"   状态码: {response.status_code}")
    print(f"   订单状态: {response.json()['status']}")
    
    # 测试获取持仓列表
    print("\n10. 测试获取持仓列表接口...")
    response = requests.get("http://localhost:8000/api/v1/trading/positions")
    print(f"   状态码: {response.status_code}")
    print(f"   持仓数量: {len(response.json())}")

# 测试前端功能
def test_frontend():
    print("\n=== 测试前端功能 ===")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 访问首页
        print("1. 访问首页...")
        page.goto("http://localhost:5174")
        page.wait_for_load_state('networkidle')
        
        # 截图首页
        page.screenshot(path='/tmp/dashboard.png', full_page=True)
        print("   首页截图已保存到 /tmp/dashboard.png")
        
        # 测试导航到回测系统
        print("\n2. 导航到回测系统...")
        page.click("text=回测系统")
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/backtest.png', full_page=True)
        print("   回测系统截图已保存到 /tmp/backtest.png")
        
        # 测试导航到交易雷达
        print("\n3. 导航到交易雷达...")
        page.click("text=交易雷达")
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/radar.png', full_page=True)
        print("   交易雷达截图已保存到 /tmp/radar.png")
        
        # 测试导航到策略管理
        print("\n4. 导航到策略管理...")
        page.click("text=策略管理")
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/strategies.png', full_page=True)
        print("   策略管理截图已保存到 /tmp/strategies.png")
        
        # 测试导航到历史记录
        print("\n5. 导航到历史记录...")
        page.click("text=历史记录")
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/history.png', full_page=True)
        print("   历史记录截图已保存到 /tmp/history.png")
        
        # 测试搜索功能
        print("\n6. 测试搜索功能...")
        search_input = page.locator("input[placeholder='搜索合约、策略...']")
        search_input.fill("螺纹钢")
        time.sleep(1)
        page.screenshot(path='/tmp/search.png', full_page=True)
        print("   搜索功能截图已保存到 /tmp/search.png")
        
        # 测试用户菜单
        print("\n7. 测试用户菜单...")
        page.click("text=TradingX")
        time.sleep(1)
        page.screenshot(path='/tmp/user_menu.png', full_page=True)
        print("   用户菜单截图已保存到 /tmp/user_menu.png")
        
        browser.close()

if __name__ == "__main__":
    try:
        test_backend_api()
        print("\n✅ 后端API测试完成！")
        print("\n前端测试需要浏览器环境，暂时跳过。")
    except Exception as e:
        print(f"\n❌ 测试过程中出现错误: {e}")
