class QrCli < Formula
  desc "Generate QR codes in your terminal"
  homepage "https://qr-cli.dev"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/asharahmed/qr-cli/releases/download/v__VERSION__/qr-macos-arm64"
      sha256 "__SHA_MACOS_ARM64__"
    end
    on_intel do
      url "https://github.com/asharahmed/qr-cli/releases/download/v__VERSION__/qr-macos-x64"
      sha256 "__SHA_MACOS_X64__"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/asharahmed/qr-cli/releases/download/v__VERSION__/qr-linux-arm64"
      sha256 "__SHA_LINUX_ARM64__"
    end
    on_intel do
      url "https://github.com/asharahmed/qr-cli/releases/download/v__VERSION__/qr-linux-x64"
      sha256 "__SHA_LINUX_X64__"
    end
  end

  def install
    bin.install Dir["qr-*"].first => "qr"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/qr --version")
    assert_match(/[█▀▄]/, shell_output("#{bin}/qr hello"))
  end
end
